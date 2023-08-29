public with sharing class PublicFileShareController {

    @AuraEnabled
    public static List<ContentDocumentLink> getContentDocuments( Id recordId){
        try {
            List<ContentDocumentLink> cdlist = new List<ContentDocumentLink>();
            cdlist = [SELECT Id, ContentDocument.Title 
                            FROM ContentDocumentLink
                            WHERE LinkedEntityId = :recordId];

            return cdlist;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}