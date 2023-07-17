({
    doInit : function(component, event, helper) {
        component.set("v.SubmitPR", true);

    },
    cancelrequest : function(component, event, helper){
        component.set("v.SubmitPR", false);
        $A.get("e.force:closeQuickAction").fire();
   },
})