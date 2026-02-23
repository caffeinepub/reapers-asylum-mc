import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include storage mixin for photo gallery
  include MixinStorage();

  // Initialize Access Control for authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Define persistent state
  var events : [Event] = [];
  var newsFeed : [News] = [];
  var members : [Member] = [];

  // User Profile type
  public type UserProfile = {
    name : Text;
    memberRole : ?MemberRole;
    joinDate : Time.Time;
    bio : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Define member roles
  public type MemberRole = {
    #president;
    #vicePresident;
    #roadCaptain;
    #secretary;
    #treasurer;
    #member;
    #guest;
  };

  // Update specific ordering to use compareRole (no access control)
  module MemberRole {
    public func compare(role1 : MemberRole, role2 : MemberRole) : Order.Order {
      let roleOrder = switch (role1, role2) {
        case (#president, #president) { return #equal };
        case (#president, _) { return #less };
        case (#vicePresident, #president) { return #greater };
        case (#vicePresident, #vicePresident) { return #equal };
        case (#vicePresident, _) { return #less };
        case (#roadCaptain, #president or #vicePresident) { return #greater };
        case (#roadCaptain, #roadCaptain) { return #equal };
        case (#roadCaptain, _) { return #less };
        case (#secretary, #president or #vicePresident or #roadCaptain) {
          return #greater;
        };
        case (#secretary, #secretary) { return #equal };
        case (#secretary, _) { return #less };
        case (#treasurer, #president or #vicePresident or #roadCaptain or #secretary) {
          return #greater;
        };
        case (#treasurer, #treasurer) { return #equal };
        case (#treasurer, _) { return #less };
        case (#member, #guest) { #less };
        case (#member, #member) { #equal };
        case (#member, _) { #greater };
        case (#guest, #guest) { return #equal };
        case (#guest, _) { return #greater };
      };
      roleOrder;
    };
  };

  // Define Member type for persistent state
  public type Member = {
    name : Text;
    role : MemberRole;
  };

  module Member {
    public func compare(member1 : Member, member2 : Member) : Order.Order {
      MemberRole.compare(member1.role, member2.role);
    };
  };

  // Define Event type
  public type Event = {
    id : Text;
    title : Text;
    description : Text;
    startTime : Time.Time;
    endTime : Time.Time;
    location : Text;
    eventType : EventType;
  };

  public type EventType = {
    #ride;
    #meeting;
    #social;
    #fundraiser;
    #other;
  };

  module Event {
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      switch (Int.compare(event1.startTime, event2.startTime)) {
        case (#equal) { event1.id.compare(event2.id) };
        case (order) { order };
      };
    };
  };

  // Define News type
  public type News = {
    id : Text;
    title : Text;
    content : Text;
    postedBy : Text;
    timestamp : Time.Time;
  };

  module News {
    public func compare(news1 : News, news2 : News) : Order.Order {
      if (news1.timestamp < news2.timestamp) {
        return #less;
      } else if (news1.timestamp > news2.timestamp) {
        return #greater;
      };
      return news1.id.compare(news2.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // Member Management
  public shared ({ caller }) func addMember(name : Text, role : MemberRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };

    let memberExists = members.any(func(m) { m.name == name });
    if (memberExists) {
      Runtime.trap("Member already exists");
    };

    let newMember : Member = { name; role };
    members := members.concat([newMember]);
  };

  public query ({ caller }) func getMembers() : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can view the roster");
    };
    members.sort();
  };

  // Events Management
  public shared ({ caller }) func addEvent(title : Text, description : Text, startTime : Time.Time, endTime : Time.Time, location : Text, eventType : EventType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add events");
    };

    let id = title.concat(startTime.toText());
    let event : Event = {
      id;
      title;
      description;
      startTime;
      endTime;
      location;
      eventType;
    };

    let eventExists = events.any(func(e) { e.id == id });
    if (eventExists) {
      Runtime.trap("Event already exists");
    };

    events := events.concat([event]);
  };

  public query ({ caller }) func getEvents() : async [Event] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can view events");
    };
    events.sort();
  };

  // News Management
  public shared ({ caller }) func postNews(title : Text, content : Text, postedBy : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can post news");
    };

    let id = title.concat(Time.now().toText());
    let news : News = {
      id;
      title;
      content;
      postedBy;
      timestamp = Time.now();
    };

    let newsExists = newsFeed.any(func(n) { n.id == id });
    if (newsExists) {
      Runtime.trap("News item already exists");
    };

    newsFeed := newsFeed.concat([news]);
  };

  public query ({ caller }) func getNewsFeed() : async [News] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can view news");
    };
    newsFeed.sort();
  };
};
