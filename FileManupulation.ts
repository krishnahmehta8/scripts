
// Command to Run Script 
//******************************************** */\
// ASSIGNMENT BY KRISHNA MEHTA 
// sudo node FileManupulation.ts execute "/home/user/Demo1/sample.pdf" "/home/user/Demo2";
// sudo node FileManupulation.ts download "/home/user/Demo1/sample.zip" "/home/user/Demo2";
// sudo node FileManupulation.ts download "http://google.com/doodle.png" "/home/user/Demo2";
// sudo node FileManupulation.ts extract "/home/user/Demo1/sample.tar.xz" "/home/user/Demo2";
// sudo node FileManupulation.ts extract "/home/user/Demo1/sample.tar.gz" "/home/user/Demo2";
//********************************************** */
















const fs = require('fs');//using node File System Package;
const { exec } = require('child_process');//exec method runs a command in a shell/console and buffers the output.
var myArgs = process.argv // Passing Argument while calling Script i.e sudo node scriptName.ts type sourcePath destinationPath 
// Type Means ['download' , 'extract' , 'execute'];
const request = require('request'); // for Downloading image from given link so i used request package for sending request for get Stream of file and write that stram of Data using Node File System lib.
// const decompress = require('decompress'); // UnZiping files from zip i.e Extraction Package



async function fileData(myArgs){//Main Function To Identify the Process 
    // console.log(myArgs[2]);
if(myArgs[2] !== undefined){  
    if(myArgs[2] == 'download'){ // Download Type
        if(myArgs[3] !== undefined){
            if(myArgs[4] !== undefined){
                await downloadFile(myArgs[3],myArgs[4]);
        }else{
                // await downloadFile(myArgs[3],"");
                console.log("Please Pass Argument with Destination Path");
        }
    }else{
            console.log("Please Pass Argument with source Path")
        }
    }else if(myArgs[2]=='extract'){ // Extract File Type
        if(myArgs[3] !== undefined){
            if(myArgs[4] !== undefined){
                await extractFile(myArgs[3],myArgs[4]);
            }else{
                await extractFile(myArgs[3],"");
            }
        }else{
                console.log("Please Pass Argument with source Path")
            }
    }else if(myArgs[2]=='execute'){ // execute Type(i.e Copy File From Source to destination)
        if(myArgs[3] !== undefined){
            if(myArgs[4] !== undefined){
                await copyFile(myArgs[3],myArgs[4]);
            }else{
                // await copyFile(myArgs[3],"");
                console.log("Please Pass Argument with Destination Path");
            }
        }else{
                console.log("Please Pass Argument with source Path");
            }
        }
        console.log(myArgs)
    }else{
        console.log("Please Pass Argument with type and SourcePath and Destination");
    }
}
    
    async function downloadFile(source,destination) {
        
        console.log("Into Download Function");
        console.log("DownloadFile from ",source," to ",destination);
        let fileName = source.substring(source.lastIndexOf('/')+1,source.length).trim();//EXTRACT fILENAME
        let isLink = source.substring(0,source.indexOf(':')).trim();
        let extension = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length).trim();//EXTRACT EXTENSTION
        console.log("fileName ---> ",fileName," extension --->>  ",extension) 
        // console.log(isLink);
        if(isLink == "http"){
            // console.log(source);
            await request(source).pipe(fs.createWriteStream(destination+'/'+fileName));
        }else{
            const file = fs.readFileSync(source);
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination);
            }
        // filePath = filePath + projectId + '-' + eventId
            await fs.writeFileSync(destination + '/' + fileName, file);
        // 'utf-8'
        }
        console.log("File is Download at Location ---->>> >>> >>> ",destination + '/' + fileName)
    };


    async function extractFile(source,destination){
        console.log("Into extractFile Function");
        console.log("Extracted file from ",source," to ",destination);
        let fileName = source.substring(source.lastIndexOf('/')+1,source.length).trim();//EXTRACT fILENAME
        let extension = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length).trim();//EXTRACT EXTENSTION
        console.log("fileName ---> ",fileName," extension --->>  ",extension);
        //FOR wINDOWS USER COMMENT OUT THIS AND RUN THE CODE ///////
        let cmd = "";
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }
        if(extension == 'zip'){
            if(destination !== ""){
                cmd = "unzip " + source + " -d " + destination
            }else{
                cmd = "unzip " + source;
            }
            
        }else if(extension == 'gz'){
            if(destination !== ""){
                cmd = "tar -xvzf" + source + " -C " + destination;
            }else{
                cmd = "tar -xvzf" + source;
            }
        }else if(extension == 'xz'){
            if(destination !== ""){
                cmd = "tar -xf" + source + " -C " + destination;
            }else{
                cmd = "tar -xf" + source;
            }
        }
        console.log(cmd);
        await terminalCommand(cmd);
        /// ******TILL HERE COMMENT FOR WINDOWS USER ******///// 
        // UNCOMMENT FOR WINDOWS USER AND IF CHECK USING PACKAGE FOR UBUNTU LINUX *****///
        //USING PACKAGE-- DECOMPRESS --- PACKAGE USING is Not Good ALWAYS so I use Terminal Command For unziping Files


        // decompress(source, destination).then(files => {
        //     console.log('done Extracting files!');
        // });


        // ********** IF WANT CAN CHECK THIS CODE ALSO FOR EXTRACTION USING PACKAGE DECOMPRESS AND ALSO FOR WINDOWS USER PLEASE REVIEW THIS CODE BY UNCOMMNETING THE CODE ************//

        console.log("ExtractingFile from Source to Destination  =---- >>> ---- >>  ",source,"   ---->> ---- >>> --->>  ",destination);
        //const file = fs.readFileSync(source);

    };

    async function terminalCommand(cmd) {

       
             return new Promise(function (resolve, reject) {//PROMISE FUNCTION 
                 exec(cmd, (err, stdout, stderr) => {//TO RUN SHELL SCRIPT
                           
                     if (err) {    
                         resolve({ status: 1, err: err });
                     }
                     if (stderr !== '') { 
                         resolve({ status: 1, err: stderr });
                     }
                     else {
                         resolve({ status: 0, output: stdout });
                     }
                 });
             });
       
     }

    async function copyFile(source,destination){
        console.log("Into Copying Function");
        console.log("Coping File from ",source," to ",destination);
        // console.log("DownloadFile from ",source," to ",destination);
        let fileName = source.substring(source.lastIndexOf('/')+1,source.length).trim();//EXTRACT fILENAME
        let extension = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length).trim();//EXTRACT EXTENSTION
        console.log("fileName ---> ",fileName," extension --->>  ",extension) 
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }
        // const file = fs.readFileSync(source);
        await fs.copyFileSync(source, destination+'/'+fileName);
        console.log("File is Copyied from Source To Destination --- >>> >>> >>>  ",source,"   ---->> --->>  ",destination);
        // filePath = filePath + projectId + '-' + eventId
    }
        
fileData(myArgs);

// console.log(process.argv[2]);
