//require('dotenv').config(); //Uncomment this line of building from source.

const https = require("https");
const schedule = require('node-schedule');
const nodemailer = require("nodemailer");


let counter = 0;
console.log("started running");
schedule.scheduleJob(process.env.FREQUENCY, function(){
    console.log("checking site status");
    runJob();
  });
const runJob = async ()=> {
    require('dotenv').config();
    const isOnline = await checkIfWebsiteIsOnline(process.env.URL,process.env.TIMEOUT);
    if(isOnline===false){
        console.log("site not reachable, checking in "+process.env.WAITUNTILRECHECK+"min again");
        await sleep(process.env.WAITUNTILRECHECK);
        const recheck = await checkIfWebsiteIsOnline(process.env.URL,process.env.TIMEOUT);
        if(recheck===false){
          counter++;
          console.log("rechecking site, still not reachable.");
          let transporter = nodemailer.createTransport({
              host: process.env.SMTPSERVER,
              port: process.env.SMTPPORT,
              secure: false,
              auth: {
                user: process.env.FROMEMAIL,
                pass: process.env.SMTPPASSWORD
              },
            });
  
          //fout meer dan maxfailurecounter
          if(counter>=process.env.MAXFAILURECOUNTER){
              console.log("MAXFAILURECOUNTER exceeded");
              try{
                await transporter.sendMail({
                  from: `"EBCS DRP server checker" <${process.env.FROMEMAIL}>`, // sender address
                  to:process.env.ADMINEMAIL,
                  bcc: process.env.EMAILLIST.split(","), // list of receivers
                  subject: process.env.EMAILSUBJECT, // Subject line
                  text: process.env.EMAILTEXT, // plain text body
                });
                counter = 0;
              }catch(e){
                counter--;
                console.log("Internet is probably down locally");
              }
                
          }else{
              console.log("did not exceed MAXFAILURECOUNTER, counter on "+counter);
              //fout minder dan maxfailurecounter
              try{
                await transporter.sendMail({
                  from: `"EBCS DRP server checker" <${process.env.FROMEMAIL}>`, // sender address
                  to:process.env.ADMINEMAIL,
                  subject: process.env.EMAILSUBJECT, // Subject line
                  text: process.env.EMAILTEXT, // plain text body
                });
              }catch(e){
                counter--;
                console.log("Internet is probably down locally");
              }
          }
        }else{

        }
    }else{
        counter = 0;
        console.log("site it reachable");
    }
}

/**
 * @method checkIfWebsiteIsOnline
 * @description checks if the provided link is offline or online
 * @param {String} url - The link of the website it should check on 
 * @returns {Boolean} - returns true if online, false if offline
 */
const checkIfWebsiteIsOnline = (url,timeout=30*100/*ms*/) => {
    return new Promise((resolve, reject) => {
        https
          .get(url, function(res) {
            resolve(res.statusCode === 200);
          })
          .on("error", function(e) {
            resolve(false);
          });

          setTimeout(()=>{
              resolve(false);
          },timeout);
      })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}