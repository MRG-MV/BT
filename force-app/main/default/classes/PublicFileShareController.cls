public with sharing class PublicFileShareController {

    @AuraEnabled
    public static List<ContentDocumentLink> getContentDocuments( Id recordId){
        try {
            List<ContentDocumentLink> cdlist = new List<ContentDocumentLink>();
            cdlist = [SELECT Id, ContentDocument.Title, ContentDocumentId, ContentDocument.LatestPublishedVersionId
                            FROM ContentDocumentLink
                            WHERE LinkedEntityId = :recordId];

            return cdlist;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<buildertek__Public_Folder__c> getFolderList(){
        try {
            List<buildertek__Public_Folder__c> publicfolders = new List<buildertek__Public_Folder__c>();
            
            publicfolders = [SELECT Id, buildertek__File_Count__c, Name, buildertek__Description__c FROM buildertek__Public_Folder__c];

            return publicfolders;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String createPublicFolder(String Fname, String Fdesc){
        try {
            buildertek__Public_Folder__c publicfol = new buildertek__Public_Folder__c();
            publicfol.Name = Fname;
            publicfol.buildertek__Description__c = Fdesc;

            insert publicfol;

            return 'Success';

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<buildertek__Public_File_Folder_Jn__c> getFileFolderJuncData(){
        try {

            List<buildertek__Public_File_Folder_Jn__c> publicfilefolderjunc = new List<buildertek__Public_File_Folder_Jn__c>();

            publicfilefolderjunc = [SELECT buildertek__Public_File__c, buildertek__Public_Folder__c FROM buildertek__Public_File_Folder_Jn__c];
            
            return publicfilefolderjunc;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createPublicFileFolderJnc( List<buildertek__Public_Folder__c> Pfolderlst, List<ContentDocumentLink> cdllist ){
        try {
            List<buildertek__Public_File__c> publicfilelst = new List<buildertek__Public_File__c>();
            List<buildertek__Public_File__c> publicfilelst2 = new List<buildertek__Public_File__c>();

            List<Id> idList = new List<Id>();

            for (ContentDocumentLink obj : cdllist) {
                idList.add(obj.ContentDocument.LatestPublishedVersionId);
            }

            publicfilelst = [SELECT Id, buildertek__Content_Version__c FROM buildertek__Public_File__c WHERE buildertek__Content_Version__c in :idList];

            System.debug('publicfiles List:- '+publicfilelst);

            Set<Id> idSet = new Set<Id>();
            for (buildertek__Public_File__c obj : publicfilelst) {
                idSet.add(obj.buildertek__Content_Version__c);
            }

            List<ContentDistribution> cdlist = new List<ContentDistribution>();

            for (ContentDocumentLink obj : cdllist) {
                if(!(idSet.contains(obj.ContentDocument.LatestPublishedVersionId))){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = obj.ContentDocument.Title;
                    cd.ContentVersionId = obj.ContentDocument.LatestPublishedVersionId;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    cdlist.add(cd);
                } else {

                }
            }

            insert cdlist;

            for (ContentDistribution cd : cdlist){
                buildertek__Public_File__c publicfile = new buildertek__Public_File__c();
                publicfile.buildertek__File_Name__c = cd.Name;
                publicfile.buildertek__Content_Distrubution__c = cd.Id;
                publicfile.buildertek__Content_Version__c = cd.ContentVersionId;
                // publicfile.buildertek__Expiry_Date__c = cd.ExpiryDate.date();
                publicfile.buildertek__Public_URL__c = cd.DistributionPublicUrl;
                publicfilelst2.add(publicfile);
            }

            insert publicfilelst2;

            System.debug('PublicFiles2 after insert :- '+publicfilelst2);

            List<buildertek__Public_File_Folder_Jn__c> publicfilefolderjunclst = new List<buildertek__Public_File_Folder_Jn__c>();
            List<buildertek__Public_File_Folder_Jn__c> publicfilefolderjunclst2 = new List<buildertek__Public_File_Folder_Jn__c>();
            
            for(buildertek__Public_Folder__c folder : Pfolderlst){

                publicfilefolderjunclst = [SELECT buildertek__Public_File__c, buildertek__Public_Folder__c FROM buildertek__Public_File_Folder_Jn__c WHERE buildertek__Public_Folder__c = :folder.Id];

                Set<Id> idSet2 = new Set<Id>();

                for (buildertek__Public_File_Folder_Jn__c obj : publicfilefolderjunclst) {
                    idSet2.add(obj.buildertek__Public_File__c);
                }

                buildertek__Public_File_Folder_Jn__c publicfilefolderjunc = new buildertek__Public_File_Folder_Jn__c();

                for(buildertek__Public_File__c pfile : publicfilelst){
                    if(!(idSet2.contains(pfile.Id))){
                        publicfilefolderjunc.buildertek__Public_File__c = pfile.Id;
                        publicfilefolderjunc.buildertek__Public_Folder__c = folder.Id;
                        publicfilefolderjunclst2.add(publicfilefolderjunc);
                    }
                }
            }

            insert publicfilefolderjunclst2;

            System.debug('Public File Folder Junction List After Insert:- '+publicfilefolderjunclst2);

            return 'Success';

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}