/* =========================================
   11PLAY WEEKLY SETTLEMENT
   LocalStorage Management System

   File:
   assets/js/storage.js

   Production Version
========================================= */


/* =========================================
   Storage Configuration
========================================= */


const STORAGE_CONFIG = {


    version:
    "1.0",


    app:
    "11Play Weekly Settlement"


};







const STORAGE_KEYS = {


    SETTLEMENTS:
    "11play_settlements",


    ACTIVE_SETTLEMENT:
    "11play_active_settlement",


    SETTINGS:
    "11play_settings"


};









/* =========================================
   Safe Storage Save
========================================= */


function saveToStorage(
    key,
    data
){


    try{


        localStorage.setItem(

            key,

            JSON.stringify(data)

        );


        return true;


    }


    catch(error){


        console.error(
            "Storage Save Error:",
            error
        );


        return false;


    }


}









/* =========================================
   Safe Storage Read
========================================= */


function getFromStorage(
    key
){


    try{


        const data =
        localStorage.getItem(
            key
        );



        if(
            !data
        ){

            return null;

        }



        return JSON.parse(
            data
        );


    }


    catch(error){


        console.error(
            "Storage Read Error:",
            error
        );


        return null;


    }


}









/* =========================================
   Remove Storage Data
========================================= */


function removeStorage(
    key
){


    try{


        localStorage.removeItem(
            key
        );


        return true;


    }


    catch(error){


        console.error(
            "Storage Remove Error:",
            error
        );


        return false;


    }


}









/* =========================================
   Settlement Validation
========================================= */


function validateSettlement(
    settlement
){


    if(
        !settlement
        ||
        typeof settlement !== "object"
    ){

        return false;

    }







    if(

        !settlement.settlementId

        ||

        !settlement.startDate

        ||

        !settlement.endDate

    ){

        return false;


    }







    if(
        !Array.isArray(
            settlement.sites
        )
    ){


        settlement.sites = [];


    }







    if(
        !settlement.status
    ){


        settlement.status =
        "ACTIVE";


    }





    return true;


}









/* =========================================
   Get Settlement History
========================================= */


function getAllSettlements(){


    const data =
    getFromStorage(

        STORAGE_KEYS.SETTLEMENTS

    );



    return Array.isArray(data)

    ?

    data

    :

    [];


}









/* =========================================
   Save Settlement History
========================================= */


function saveAllSettlements(
    settlements
){


    if(
        !Array.isArray(
            settlements
        )
    ){

        return false;


    }



    return saveToStorage(

        STORAGE_KEYS.SETTLEMENTS,

        settlements

    );


}









/* =========================================
   Add Settlement
========================================= */


function addSettlement(
    settlement
){


    if(
        !validateSettlement(
            settlement
        )
    ){

        return false;

    }





    const settlements =
    getAllSettlements();






    const exists =
    settlements.some(
        item=>

        item.settlementId ===
        settlement.settlementId

    );






    if(
        exists
    ){

        return false;

    }







    settlements.push(
        settlement
    );







    return saveAllSettlements(
        settlements
    );


}
/* =========================================
   Update Settlement
========================================= */


function updateSettlement(
    updatedSettlement
){


    if(
        !validateSettlement(
            updatedSettlement
        )
    ){

        return false;

    }







    let settlements =
    getAllSettlements();







    let updated =
    false;







    settlements =
    settlements.map(
        item=>{


            if(
                item.settlementId ===
                updatedSettlement.settlementId
            ){


                updated = true;


                return updatedSettlement;


            }



            return item;


        }

    );







    if(
        !updated
    ){

        return false;

    }







    return saveAllSettlements(
        settlements
    );


}









/* =========================================
   Delete Settlement
========================================= */


function deleteSettlement(
    settlementId
){



    let settlements =
    getAllSettlements();







    const oldLength =
    settlements.length;







    settlements =
    settlements.filter(
        item=>

        item.settlementId !== settlementId

    );








    if(
        oldLength ===
        settlements.length
    ){

        return false;

    }







    return saveAllSettlements(
        settlements
    );


}









/* =========================================
   Active Settlement
========================================= */


function getActiveSettlement(){


    return getFromStorage(

        STORAGE_KEYS.ACTIVE_SETTLEMENT

    );


}









function saveActiveSettlement(
    settlement
){



    if(
        !validateSettlement(
            settlement
        )
    ){

        return false;

    }







    return saveToStorage(

        STORAGE_KEYS.ACTIVE_SETTLEMENT,

        settlement

    );


}









function removeActiveSettlement(){



    return removeStorage(

        STORAGE_KEYS.ACTIVE_SETTLEMENT

    );


}









/* =========================================
   Settlement ID Generator

   Format:
   SET-2026-001
========================================= */


function generateSettlementId(){



    const settlements =
    getAllSettlements();






    const year =
    new Date()
    .getFullYear();







    let maxNumber =
    0;








    settlements.forEach(
        item=>{


            if(
                item.settlementId
                &&
                item.settlementId.startsWith(
                    `SET-${year}-`
                )
            ){



                const number =
                parseInt(
                    item.settlementId.split("-")[2]
                );





                if(
                    !isNaN(number)
                    &&
                    number > maxNumber
                ){


                    maxNumber =
                    number;


                }



            }



        }

    );







    return (

        `SET-${year}-`

        +

        String(
            maxNumber + 1
        )
        .padStart(
            3,
            "0"
        )

    );


}









/* =========================================
   Settings Management
========================================= */


function getSettings(){



    return (

        getFromStorage(
            STORAGE_KEYS.SETTINGS
        )

        ||

        {

            version:
            STORAGE_CONFIG.version,


            currency:
            "BDT"


        }

    );


}









function saveSettings(
    settings
){


    if(
        !settings
        ||
        typeof settings !== "object"
    ){

        return false;

    }







    return saveToStorage(

        STORAGE_KEYS.SETTINGS,

        settings

    );


}









/* =========================================
   Full Backup Data
========================================= */


function getFullBackupData(){



    return {


        app:
        STORAGE_CONFIG.app,


        version:
        STORAGE_CONFIG.version,



        settlements:
        getAllSettlements(),



        activeSettlement:
        getActiveSettlement(),



        settings:
        getSettings(),



        backupDate:
        new Date()
        .toISOString()



    };


}









/* =========================================
   Restore Backup Data
========================================= */


function restoreFullBackupData(
    data
){



    if(
        !data
        ||
        typeof data !== "object"
    ){

        return false;

    }







    try{



        if(
            Array.isArray(
                data.settlements
            )
        ){


            const validSettlements =

            data.settlements.filter(
                item=>

                validateSettlement(
                    item
                )

            );



            saveAllSettlements(
                validSettlements
            );


        }







        if(
            validateSettlement(
                data.activeSettlement
            )
        ){



            saveActiveSettlement(
                data.activeSettlement
            );


        }







        if(
            data.settings
        ){


            saveSettings(
                data.settings
            );


        }







        return true;



    }



    catch(error){


        console.error(
            "Restore Error:",
            error
        );


        return false;


    }


}









/* =========================================
   Clear Application Data
========================================= */


function clearAllStorage(){



    const confirmDelete =
    confirm(

        "Are you sure you want to delete all settlement data?"

    );







    if(
        !confirmDelete
    ){

        return false;


    }







    removeStorage(
        STORAGE_KEYS.SETTLEMENTS
    );



    removeStorage(
        STORAGE_KEYS.ACTIVE_SETTLEMENT
    );



    removeStorage(
        STORAGE_KEYS.SETTINGS
    );







    return true;


}
