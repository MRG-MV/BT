import { LightningElement, track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import PDF_Resource from '@salesforce/resourceUrl/Releasenote';
import designcss from '@salesforce/resourceUrl/designcss'

export default class Qf_guide2 extends LightningElement {
  @track spinnerdatatable = false;
  error_toast = true;
  pdfUrl;
  activeSections = ['A'];
  activeSectionsMessage = '';
  supportname;
    

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

    connectedCallback() {
        this.pdfUrl = PDF_Resource;
        loadStyle(this, designcss);
    }

  renderedCallback() {
    this.template.querySelectorAll("a").forEach(element => {
      element.addEventListener("click", evt => {
        let target = evt.currentTarget.dataset.tabId;

        this.template.querySelectorAll("a").forEach(tabel => {
          if (tabel === element) {
            tabel.classList.add("active-tab");
          } else {
            tabel.classList.remove("active-tab");
          }
        });
        this.template.querySelectorAll(".tab").forEach(tabdata => {
          tabdata.classList.remove("active-tab-content");
        });
        this.template.querySelector('[data-id="' + target + '"]').classList.add("active-tab-content");
      });
    });
  }


  tabing() {
    const target = "tab1";
    this.template.querySelectorAll("a").forEach(tabel => {
      tabel.classList.remove("active-tab");
    });
    this.template.querySelectorAll(".tab").forEach(tabdata => {
      tabdata.classList.remove("active-tab-content");
    });
    this.template.querySelector('[data-tab-id="' + target + '"]').classList.add("active-tab");
    this.template.querySelector('[data-id="' + target + '"]').classList.add("active-tab-content");
  }

  Support_name(event) {
    this.supportname = event.target.value;
    this.name_msg = true;
}
name_msg = true;
email;
subject;
message;
email_msg = true;
Message_msg = true;
subject_msg = true;
Message_msg = true;
Support_email(event) {
  this.email = event.target.value;
  this.email_msg = true;
}
Quickbot_cc(event) {
  this.quickbotcc = event.target.value;
  this.cc_msg = true;
}
Support_message(event) {
  this.message = event.target.value;
  this.Message_msg = true;

}
Support_subject(event) {
  this.subject = event.target.value;
  this.subject_msg = true;

}
onSubmit() {

  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var validation1 = pattern.test(this.email);
  var validation2 = true;
  this.supportname = this.supportname.trim();
  this.subject = this.subject.trim();
  this.message = this.message.trim();
  if ((this.supportname == undefined) || (this.supportname == '')) {
      this.name_msg = false;
  } else if (validation1 == false) {
      this.email_msg = false;
  } else if ((validation2 == false)) {
      this.cc_msg = false;
  } else if (this.subject == undefined || (this.subject == '')) {
      this.subject_msg = false;
  } else if (this.message == undefined || (this.message == '')) {
      this.Message_msg = false;
  } else {
      this.email_msg = true;
      // sendemail({
      //         name: this.supportname,
      //         email: this.email,
      //         subject: this.subject,
      //         body: this.message,
      //         fname: this.FName,
      //         fbase64: this.FBase64,
      //     })
      //     .then(result => {
      //         if(result == 'success'){
      //             this.emailsend = true;
      //             this.dispatchEvent(new CustomEvent('botclose', {
      //                 detail: this.emailsend
      //             }));
      //             this.dispatchEvent(new CustomEvent('success'));
      //         }else{
      //             this.error_toast = true;
      //             let toast_error_msg = 'Email was not sent, Something went wrong.';
      //             this.template.querySelector('c-toast-component').showToast('error', toast_error_msg, 3000);
      //         }
      //     })

      const value = false;
      const valueChangeEvent = new CustomEvent("valuechange", {
          detail: {
              value
          }
      });
      this.dispatchEvent(valueChangeEvent);
  }

}

  
}