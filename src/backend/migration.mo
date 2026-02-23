import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type OldMember = {
    name : Text;
    role : {
      #president;
      #vicePresident;
      #roadCaptain;
      #secretary;
      #treasurer;
      #member;
      #guest;
    };
  };

  type OldActor = {
    membershipInitialized : Bool;
    events : [
      {
        id : Text;
        title : Text;
        description : Text;
        startTime : Int;
        endTime : Int;
        location : Text;
        eventType : {
          #ride;
          #meeting;
          #social;
          #fundraiser;
          #other;
        };
      }
    ];
    newsFeed : [
      {
        id : Text;
        title : Text;
        content : Text;
        postedBy : Text;
        timestamp : Int;
      }
    ];
    members : [OldMember];
    userProfiles : Map.Map<Principal, {
      name : Text;
      memberRole : ?{
        #president;
        #vicePresident;
        #roadCaptain;
        #secretary;
        #treasurer;
        #member;
        #guest;
      };
      joinDate : Int;
      bio : Text;
    }>;
  };

  type NewMember = {
    id : Text;
    name : Text;
    role : {
      #president;
      #vicePresident;
      #roadCaptain;
      #secretary;
      #treasurer;
      #member;
      #guest;
    };
    photoUrl : Text;
    bio : ?Text;
  };

  type NewActor = {
    membershipInitialized : Bool;
    events : [
      {
        id : Text;
        title : Text;
        description : Text;
        startTime : Int;
        endTime : Int;
        location : Text;
        eventType : {
          #ride;
          #meeting;
          #social;
          #fundraiser;
          #other;
        };
      }
    ];
    newsFeed : [
      {
        id : Text;
        title : Text;
        content : Text;
        postedBy : Text;
        timestamp : Int;
      }
    ];
    members : [NewMember];
    userProfiles : Map.Map<Principal, {
      name : Text;
      memberRole : ?{
        #president;
        #vicePresident;
        #roadCaptain;
        #secretary;
        #treasurer;
        #member;
        #guest;
      };
      joinDate : Int;
      bio : Text;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let newMembers = old.members.map(
      func(oldMember) {
        {
          id = oldMember.name;
          name = oldMember.name;
          role = oldMember.role;
          photoUrl = "";
          bio = null;
        };
      }
    );
    {
      old with
      members = newMembers;
    };
  };
};
