import { LightningElement, track, wire, api } from 'lwc';
import getFolderList from "@salesforce/apex/PublicFileShareController.getFolderList";
import createPublicFolder from "@salesforce/apex/PublicFileShareController.createPublicFolder";
import ConfirmationPageSiteURL from "@salesforce/apex/PublicFileShareController.ConfirmationPageSiteUR";
import {NavigationMixin} from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PublicFileShareLWC extends NavigationMixin(LightningElement) {

    @api recordId; // Passed record ID
    @track spinnerDataTable = true;
    @track folderData = [];
    @track selectedFolder = '';
    @track showManageFolder = false;

    @track showNewFolderPopup = false;
    @track newFolderName = '';
    @track newFolderDescription = '';
    @track FileSiteURL = '';
    connectedCallback() {
        try {
            this.getFolderDataFromApex();
            this.getConfirmationPageSiteURLfromAPEX();            
        } catch (error) {
            console.error(error);
        }
    }

    getFolderDataFromApex(){
        getFolderList()
            .then((response) =>{
                console.log("FolderData:- ",response);
                this.folderData = response;
                this.spinnerDataTable = false
            });
    }

    getConfirmationPageSiteURLfromAPEX(){
        ConfirmationPageSiteURL()
        .then(result => {
            if(result != null){
                this.FileSiteURL = result;
            }
        })
    }
    handleNewFolder(event){
        this.showNewFolderPopup = true;
    }

    handleNameChange(event) {
        this.newFolderName = event.target.value;
    }

    handleDescriptionChange(event) {
        this.newFolderDescription = event.target.value;
    }

    createFolder(){
            if(this.newFolderName == null || this.newFolderName == ''){
                // this.template.querySelector('c-toast-component').showToast('error', 'Name is Required, Please Fill the Name', 3000);
                this.showToast('error', 'Name is Required, Please Fill the Name', 'Uh oh, something went wrong');
            }
            else{
                this.spinnerDataTable = true
                this.showNewFolderPopup = false
                createPublicFolder({ Fname : this.newFolderName, Fdesc : this.newFolderDescription })
                .then((response) =>{
                    console.log('Response for create folder :- ',response);
                    this.getFolderDataFromApex()
                    // this.template.querySelector('c-toast-component').showToast('success', 'New Folder Created Successfully', 3000);
                    this.showToast('success', 'New Folder Created Successfully', 'Yay! Everything worked!');
                    this.spinnerDataTable = false
                })
            }
    }

    manageFolder(event){
        let folderId = event.currentTarget.dataset.id;
        this.selectedFolder = folderId;
        this.showManageFolder = true;
    }

    closeManageFolder(){
        this.showManageFolder = false;
    }

    closeCreateFolder(){
        this.showNewFolderPopup = false;
    }

    copySiteURL(event){
        try {

            var copy_to_clipboad = this.FileSiteURL + 'apex/buildertek__DisplayPublicFolderPage?Id='+ event.currentTarget.dataset.link;

            const textarea = document.createElement('textarea');
            textarea.value = copy_to_clipboad;
            document.body.appendChild(textarea);                
            textarea.select();
            textarea.setSelectionRange(0,99999); // for mobile devices;
            document.execCommand('copy');
            document.body.removeChild(textarea);   

            // Display Copied Info Popup
            const copyInfoPopup = this.template.querySelector(`[data-id="${event.currentTarget.dataset.link}"]`);
            copyInfoPopup.style = 'display : block';
            copyInfoPopup.classList.add('showPopup');
            setTimeout(() => {
                copyInfoPopup.classList.remove('showPopup')
                copyInfoPopup.style = '';
            }, 1000);

        } catch (error) {
            console.log('error in copySiteURL :> ', error.stack);
            
        }
    }

    showToast(Variant , Message, Title) {
        const event = new ShowToastEvent({
            title: Title,
            message: Message,
            variant: Variant
        });
        this.dispatchEvent(event);
    }

}