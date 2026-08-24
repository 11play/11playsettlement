/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Backup & Restore System

   File:
   assets/js/backup.js

   Final Production Version
========================================= */


/* =========================================
   Backup Configuration
========================================= */


const BACKUP_CONFIG = {


    version:
    "2.0",


    app:
    "11Play Weekly Settlement",


    autoBackupKey:
    "11play_auto_backup",


    maxFileSize:
    5 * 1024 * 1024


};









/* =========================================
   Create Backup Object

========================================= */


function createBackupObject(){


    return {


        app:
        BACKUP_CONFIG.app,



        version:
        BACKUP_CONFIG.version,



        exportedAt:
        new Date()
        .toISOString(),



        data:
        getFullBackupData()



    };


}









/* =========================================
   Export Backup

   Create JSON Backup File

========================================= */


function exportBackup(){


    try{


        const backupData =
        createBackupObject();




        const json =
        JSON.stringify(
            backupData,
            null,
            4
        );




        const blob =
        new Blob(

            [
                json
            ],

            {

                type:
                "application/json"

            }

        );




        const url =
        URL.createObjectURL(
            blob
        );




        const link =
        document.createElement(
            "a"
        );




        const date =
        new Date()
        .toISOString()
        .split("T")[0];




        link.href =
        url;



        link.download =
        `11Play-Settlement-Backup-${date}.json`;




        document.body.appendChild(
            link
        );




        link.click();




        document.body.removeChild(
            link
        );




        setTimeout(()=>{


            URL.revokeObjectURL(
                url
            );


        },1000);




        return true;



    }


    catch(error){


        console.error(
            "Backup Export Error:",
            error
        );



        alert(
            "Backup export failed."
        );



        return false;


    }


}









/* =========================================
   Validate Backup Structure

========================================= */


function validateBackupData(data){



    if(
        !data
        ||
        typeof data !== "object"
    ){


        return false;


    }







    if(
        data.app !==
        BACKUP_CONFIG.app
    ){


        return false;


    }







    if(
        !data.data
        ||
        typeof data.data !== "object"
    ){


        return false;


    }







    if(
        !Array.isArray(
            data.data.settlements
        )
    ){


        return false;


    }






    return true;



}









/* =========================================
   Extract Backup Data

========================================= */


function extractBackupData(data){



    if(
        data
        &&
        data.data
        &&
        Array.isArray(
            data.data.settlements
        )
    ){


        return data.data;


    }






    return null;



}









/* =========================================
   Import Backup File

========================================= */


function importBackup(file){



    if(!file){


        alert(
            "Please select backup file."
        );


        return false;


    }








    if(
        file.size >
        BACKUP_CONFIG.maxFileSize
    ){


        alert(
            "Backup file is too large."
        );


        return false;


    }








    const reader =
    new FileReader();








    reader.onload =
    function(event){



        try{



            const backup =
            JSON.parse(
                event.target.result
            );








            if(
                !validateBackupData(
                    backup
                )
            ){



                alert(
                    "Invalid backup file."
                );


                return;


            }








            const restoreData =
            extractBackupData(
                backup
            );








            if(!restoreData){



                alert(
                    "Backup extraction failed."
                );


                return;


            }








            const oldBackup =
            getFullBackupData();









            const confirmRestore =
            confirm(

            "Current data will be replaced. Continue?"

            );









            if(!confirmRestore){


                return;


            }








            const restored =
            restoreFullBackupData(
                restoreData
            );








            if(restored){



                autoBackup();



                alert(
                    "Backup restored successfully."
                );



                location.reload();



            }

            else{



                restoreFullBackupData(
                    oldBackup
                );



                alert(
                    "Restore failed. Previous data recovered."
                );



            }







        }



        catch(error){



            console.error(
                "Import Backup Error:",
                error
            );



            alert(
                "Backup file corrupted."
            );


        }



    };








    reader.onerror =
    function(){



        alert(
            "Unable to read backup file."
        );


    };








    reader.readAsText(
        file
    );



}









/* =========================================
   Backup Summary

========================================= */


function getBackupSummary(){



    const data =
    getFullBackupData();





    return {


        totalSettlements:

        Array.isArray(
            data.settlements
        )

        ?

        data.settlements.length

        :

        0,





        activeSettlement:

        data.activeSettlement

        ?

        data.activeSettlement.settlementId

        :

        null,





        backupDate:

        data.backupDate



    };


}
/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Backup & Restore System

   File:
   assets/js/backup.js

   Part-2
========================================= */








/* =========================================
   Auto Backup

   Safety Copy
========================================= */


function autoBackup(){



    try{



        const backup =
        getFullBackupData();








        localStorage.setItem(


            BACKUP_CONFIG.autoBackupKey,


            JSON.stringify(
                backup
            )


        );







        return true;



    }



    catch(error){



        console.error(

            "Auto Backup Error:",

            error

        );






        return false;



    }



}









/* =========================================
   Restore Auto Backup

========================================= */


function restoreAutoBackup(){



    try{



        const backup =

        localStorage.getItem(

            BACKUP_CONFIG.autoBackupKey

        );








        if(!backup){


            return false;


        }








        const data =

        JSON.parse(

            backup

        );








        if(

            !data

            ||

            !Array.isArray(

                data.settlements

            )

        ){



            return false;



        }








        return restoreFullBackupData(

            data

        );



    }





    catch(error){



        console.error(

            "Auto Restore Error:",

            error

        );






        return false;



    }



}









/* =========================================
   Clear Auto Backup
========================================= */


function clearAutoBackup(){



    try{



        localStorage.removeItem(

            BACKUP_CONFIG.autoBackupKey

        );




        return true;



    }



    catch(error){



        console.error(

            "Clear Auto Backup Error:",

            error

        );



        return false;



    }



}









/* =========================================
   Download Backup Manually

========================================= */


function downloadBackupNow(){



    return exportBackup();



}









/* =========================================
   Backup Button Events

========================================= */


function initializeBackup(){



    const exportBtn =

    document.getElementById(

        "exportBackupBtn"

    );








    if(exportBtn){



        exportBtn.onclick =

        function(){



            exportBackup();



        };



    }









    const importInput =

    document.getElementById(

        "importBackupInput"

    );








    if(importInput){



        importInput.onchange =

        function(event){



            const file =

            event.target.files[0];








            importBackup(

                file

            );








            event.target.value =

            "";



        };



    }








    const autoRestoreBtn =

    document.getElementById(

        "restoreAutoBackupBtn"

    );








    if(autoRestoreBtn){



        autoRestoreBtn.onclick =

        function(){



            const restored =

            restoreAutoBackup();







            if(restored){



                alert(

                    "Auto backup restored successfully."

                );



                location.reload();



            }

            else{



                alert(

                    "No auto backup available."

                );



            }



        };



    }








    const clearBtn =

    document.getElementById(

        "clearAutoBackupBtn"

    );








    if(clearBtn){



        clearBtn.onclick =

        function(){



            const result =

            clearAutoBackup();







            if(result){



                alert(

                    "Auto backup cleared."

                );



            }



        };



    }



}









/* =========================================
   Automatic Backup After Data Change

   Helper Function
========================================= */


function runSafetyBackup(){



    return autoBackup();



}









/* =========================================
   Backup Before Critical Action

========================================= */


function backupBeforeAction(){



    const saved =

    autoBackup();






    if(!saved){



        console.warn(

            "Safety backup failed."

        );



    }







    return saved;



}









/* =========================================
   Backup System Status

========================================= */


function getBackupStatus(){



    const backup =

    localStorage.getItem(

        BACKUP_CONFIG.autoBackupKey

    );








    return {


        available:

        !!backup,




        size:

        backup

        ?

        backup.length

        :

        0,




        lastBackup:

        backup

        ?

        JSON.parse(
            backup
        )
        .backupDate

        :

        null



    };



}