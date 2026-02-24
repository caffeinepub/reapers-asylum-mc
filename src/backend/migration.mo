import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Type definitions replicated from original actor
  type OldMemberRole = {
    #president;
    #vicePresident;
    #roadCaptain;
    #secretary;
    #treasurer;
    #member;
    #guest;
  };

  type OldMember = {
    id : Text;
    name : Text;
    role : OldMemberRole;
    photoUrl : Text;
    bio : ?Text;
  };

  type OldUserProfile = {
    name : Text;
    memberRole : ?OldMemberRole;
    joinDate : Int;
    bio : Text;
  };

  // Replicate types for Event and News from original actor
  type EventType = {
    #ride;
    #meeting;
    #social;
    #fundraiser;
    #other;
  };

  type Event = {
    id : Text;
    title : Text;
    description : Text;
    startTime : Int;
    endTime : Int;
    location : Text;
    eventType : EventType;
  };

  type News = {
    id : Text;
    title : Text;
    content : Text;
    postedBy : Text;
    timestamp : Int;
  };

  type OldActor = {
    membershipInitialized : Bool;
    events : [Event];
    newsFeed : [News];
    members : [OldMember];
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // Define new structures
  type ExtendedMemberRole = {
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

  type ExtendedMember = {
    id : Text;
    name : Text;
    role : ExtendedMemberRole;
    photoUrl : Text;
    bio : ?Text;
  };

  type ExtendedUserProfile = {
    name : Text;
    memberRole : ?ExtendedMemberRole;
    joinDate : Int;
    bio : Text;
  };

  type NewActor = {
    membershipInitialized : Bool;
    events : [Event];
    newsFeed : [News];
    members : [ExtendedMember];
    userProfiles : Map.Map<Principal, ExtendedUserProfile>;
  };

  // Conversion function from old to new types
  func convertRole(oldRole : OldMemberRole) : ExtendedMemberRole {
    switch (oldRole) {
      case (#president) { #president };
      case (#vicePresident) { #vicePresident };
      case (#roadCaptain) { #roadCaptain };
      case (#secretary) { #secretary };
      case (#treasurer) { #treasurer };
      case (#member) { #member };
      case (#guest) { #prospect };
    };
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    // Migrate members
    let newMembers = old.members.map(
      func(member) {
        {
          member with
          role = convertRole(member.role);
        };
      }
    );

    // Migrate userProfiles
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, ExtendedUserProfile>(
      func(_key, oldUserProfile) {
        {
          oldUserProfile with
          memberRole = switch (oldUserProfile.memberRole) {
            case (null) { null };
            case (?role) { ?convertRole(role) };
          };
        };
      }
    );

    {
      old with
      members = newMembers;
      userProfiles = newUserProfiles;
    };
  };
};
