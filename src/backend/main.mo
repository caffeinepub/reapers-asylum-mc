import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Persistent state
  var membershipInitialized : Bool = false;
  var events : [Event] = [];
  var newsFeed : [News] = [];
  var members : [Member] = [];
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type MemberRole = {
    #president;
    #vicePresident;
    #roadCaptain;
    #secretary;
    #sergeantAtArms;
    #treasurer;
    #enforcer;
    #tailGunner;
    #chaplain;
    #prospect;
    #member;
  };

  // Explicit compare implementation for MemberRole
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

        case (#secretary, #president or #vicePresident or #roadCaptain) { return #greater };
        case (#secretary, #secretary) { return #equal };
        case (#secretary, _) { return #less };

        case (#sergeantAtArms, #president or #vicePresident or #roadCaptain or #secretary) {
          return #greater;
        };
        case (#sergeantAtArms, #sergeantAtArms) { return #equal };
        case (#sergeantAtArms, _) { return #less };

        case (#treasurer, #president or #vicePresident or #roadCaptain or #secretary or #sergeantAtArms) {
          return #greater;
        };
        case (#treasurer, #treasurer) { return #equal };
        case (#treasurer, _) { return #less };

        case (#enforcer, #president or #vicePresident or #roadCaptain or #secretary or #sergeantAtArms or #treasurer) {
          return #greater;
        };
        case (#enforcer, #enforcer) { return #equal };
        case (#enforcer, _) { return #less };

        case (#tailGunner, #president or #vicePresident or #roadCaptain or #secretary or #sergeantAtArms or #treasurer or #enforcer) {
          return #greater;
        };
        case (#tailGunner, #tailGunner) { return #equal };
        case (#tailGunner, _) { return #less };

        case (#chaplain, #president or #vicePresident or #roadCaptain or #secretary or #sergeantAtArms or #treasurer or #enforcer or #tailGunner) {
          return #greater;
        };
        case (#chaplain, #chaplain) { return #equal };
        case (#chaplain, _) { return #less };

        case (#prospect, #member) { #less };
        case (#prospect, #prospect) { #equal };
        case (#prospect, _) { #greater };

        case (#member, #member) { return #equal };
        case (#member, _) { return #greater };
      };
      roleOrder;
    };
  };

  public type Member = {
    id : Text;
    name : Text;
    role : MemberRole;
    photoUrl : Text;
    bio : ?Text;
  };

  // Explicit compare implementation for Member
  module Member {
    public func compare(member1 : Member, member2 : Member) : Order.Order {
      switch (MemberRole.compare(member1.role, member2.role)) {
        case (#equal) { member1.name.compare(member2.name) };
        case (order) { order };
      };
    };
  };

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

  // Explicit compare implementation for Event
  module Event {
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      switch (Int.compare(event1.startTime, event2.startTime)) {
        case (#equal) { event1.id.compare(event2.id) };
        case (order) { order };
      };
    };
  };

  public type News = {
    id : Text;
    title : Text;
    content : Text;
    postedBy : Text;
    timestamp : Time.Time;
  };

  // Explicit compare implementation for News
  module News {
    public func compare(news1 : News, news2 : News) : Order.Order {
      switch (Int.compare(news1.timestamp, news2.timestamp)) {
        case (#equal) { news1.id.compare(news2.id) };
        case (order) { order };
      };
    };
  };

  public type UserProfile = {
    name : Text;
    memberRole : ?MemberRole;
    joinDate : Time.Time;
    bio : Text;
  };

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
    // Check if this is the first user creating a profile
    let isFirstUser = userProfiles.size() == 0 and not membershipInitialized;

    if (isFirstUser) {
      // First user automatically becomes admin
      AccessControl.assignRole(accessControlState, caller, caller, #admin);

      // Create admin profile with president role
      let adminProfile : UserProfile = {
        name = profile.name;
        memberRole = ?#president;
        joinDate = Time.now();
        bio = profile.bio;
      };

      userProfiles.add(caller, adminProfile);

      // Add to members list
      members := [
        {
          id = profile.name;
          name = profile.name;
          role = #president;
          photoUrl = "";
          bio = null;
        },
      ];

      membershipInitialized := true;
    } else {
      // Regular user profile save - requires user permission
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only members can save their profile");
      };
      userProfiles.add(caller, profile);
    };
  };

  public shared ({ caller }) func addMember(name : Text, role : MemberRole, photoUrl : Text, bio : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };

    let newMember : Member = {
      id = name.concat(Time.now().toText());
      name;
      role;
      photoUrl;
      bio;
    };
    members := members.concat([newMember]);
  };

  public shared ({ caller }) func updateMember(id : Text, name : Text, role : MemberRole, photoUrl : Text, bio : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update members");
    };

    let updatedMembers = members.map(
      func(member) {
        if (member.id == id) {
          {
            id;
            name;
            role;
            photoUrl;
            bio;
          };
        } else {
          member;
        };
      }
    );
    members := updatedMembers;
  };

  public shared ({ caller }) func deleteMember(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete members");
    };

    let filteredMembers = members.filter(func(member) { member.id != id });
    members := filteredMembers;
  };

  public query ({ caller }) func getMembers() : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can view the roster");
    };
    members.sort();
  };

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
