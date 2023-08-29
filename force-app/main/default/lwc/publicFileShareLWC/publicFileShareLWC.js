import { LightningElement, track, wire, api } from 'lwc';
import  getContentDocuments from "@salesforce/apex/PublicFileShareController.getContentDocuments";
import {NavigationMixin} from 'lightning/navigation'

export default class PublicFileShareLWC extends NavigationMixin(LightningElement) {

    @api recordId; // Passed record ID
    @track contentDocuments = [] ; // All content documents
    @track selectedDocuments = []; // Selected documents

    connectedCallback() {
        // Fetch content documents for the passed record ID
        try {
            getContentDocuments({recordId:this.recordId})
            .then ((response) =>{
                console.log(response)
                console.log(typeof(response))
                const arrayOfObj = Object.values(response);
                console.log("arrayOfObj :- ",arrayOfObj)

                this.contentDocuments = arrayOfObj;
                console.log("ContentDocuments :- ",this.contentDocuments)
            });
        } catch (error) {
            console.error(error);
        }
    }

    handleCheckboxChange(event) {
        const selectedDocId = event.target.value;
        const isChecked = event.target.checked;
        console.log('selectedDocId :- ',selectedDocId)

        if (isChecked) {
            console.log('isChecked in IF :- ', isChecked);
            this.contentDocuments.forEach(element => {
                console.log(JSON.stringify(element))
                if(element.ContentDocument.Id === selectedDocId){
                    this.selectedDocuments.push(element)
                }
            });
            // const selectedDoc = this.contentDocuments.find(doc => doc.ContentDocument.Id === selectedDocId);
            // if (selectedDoc) {
                // this.selectedDocuments = [...this.selectedDocuments, selectedDoc];
            // }
            console.log('selectedDocuments :- ',this.selectedDocuments);
        } else {
            console.log('isChecked in ELSE :- ', isChecked);
            this.selectedDocuments = this.selectedDocuments.filter(doc => doc.ContentDocument.Id !== selectedDocId);
            console.log('selectedDocuments :- ',this.selectedDocuments);
        }
    }

    previewHandler(event){
        console.log('dataset id:- ',event.target.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{ 
                selectedRecordId: event.target.dataset.id
            }
        })
    }

}