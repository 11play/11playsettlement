/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Settlement Management System

   File:
   assets/js/settlement.js

   Final Production Version
========================================= */


/* =========================================
   Create New Settlement

   User Controlled Date
========================================= */


function createNewSettlement(
    startDate,
    endDate
){


    const existing =
    getActiveSettlement();




    if(existing){


        alert(
            "An active settlement already exists. Please finalize it first."
        );


        return null;


    }






    if(
        !startDate ||
        !endDate
    ){


        alert(
            "Please select settlement start and end date."
        );


        return null;


    }






    const settlement = {


        settlementId:
        generateSettlementId(),



        startDate:
        startDate,



        endDate:
        endDate,



        status:
        "ACTIVE",



        createdAt:
        new Date()
        .toISOString(),



        finalizedAt:
        null,



        sites:
        [],



        distribution:
        {},



        signatures:
        {

            selim:"",
            farid:"",
            rafiqul:""

        }


    };








    const saved =
    saveActiveSettlement(
        settlement
    );







    if(!saved){


        alert(
            "Unable to create settlement. Storage error."
        );


        return null;


    }








    return settlement;



}









/* =========================================
   Get Current Settlement
========================================= */


function getCurrentSettlement(){


    return getActiveSettlement();


}









/* =========================================
   Check Editable Status
========================================= */


function isSettlementEditable(
    settlement
){



    return Boolean(

        settlement

        &&

        settlement.status === "ACTIVE"

    );


}









/* =========================================
   Add Site Entry
========================================= */


function addSiteEntry(
    siteName,
    amount,
    entryDate
){



    const settlement =
    getActiveSettlement();








    if(
        !isSettlementEditable(
            settlement
        )
    ){



        alert(
            "Settlement is locked."
        );



        return false;


    }








    if(
        !siteName
        ||
        String(siteName).trim()===""
    ){



        alert(
            "Site name is required."
        );



        return false;


    }








    const site =
    createSiteObject(
        siteName,
        amount,
        entryDate
    );







    settlement.sites.push(
        site
    );







    const saved =
    saveActiveSettlement(
        settlement
    );








    if(!saved){



        alert(
            "Unable to save site entry."
        );



        return false;


    }







    return true;



}









/* =========================================
   Update Site Entry
========================================= */


function updateSiteEntry(
    siteId,
    updatedData={}
){



    const settlement =
    getActiveSettlement();








    if(
        !isSettlementEditable(
            settlement
        )
    ){


        return false;


    }








    let updated = false;








    settlement.sites =
    settlement.sites.map(
        site=>{





            if(
                String(site.id) ===
                String(siteId)
            ){



                updated = true;






                const amount =
                validateAmount(
                    updatedData.amount
                    ??
                    site.amount
                );







                return {


                    ...site,


                    ...updatedData,


                    amount,


                    profit:
                    checkProfitStatus(
                        amount
                    )


                };



            }






            return site;



        }

    );







    if(!updated){


        return false;


    }







    return saveActiveSettlement(
        settlement
    );



}









/* =========================================
   Delete Site Entry
========================================= */


function deleteSiteEntry(
    siteId
){



    const settlement =
    getActiveSettlement();







    if(
        !isSettlementEditable(
            settlement
        )
    ){


        return false;


    }








    const oldLength =
    settlement.sites.length;








    settlement.sites =
    settlement.sites.filter(
        site=>

        String(site.id) !==
        String(siteId)

    );







    if(
        oldLength ===
        settlement.sites.length
    ){


        return false;


    }








    return saveActiveSettlement(
        settlement
    );



}









/* =========================================
   Finalize Settlement
========================================= */


function finalizeSettlement(){



    const settlement =
    getActiveSettlement();







    if(!settlement){



        alert(
            "No active settlement found."
        );



        return false;



    }








    if(
        settlement.status !== "ACTIVE"
    ){



        alert(
            "Settlement is already finalized."
        );



        return false;



    }









    const confirmFinalize =
    confirm(
        "Are you sure you want to finalize this settlement?"
    );







    if(!confirmFinalize){



        return false;



    }









    const result =
    calculateSettlementResult(
        settlement
    );









    if(
        !validateDistribution(
            result
        )
    ){



        alert(
            "Settlement calculation error."
        );



        return false;



    }
    /* =========================================
   Continue Finalize Settlement
========================================= */


    const finalizedSettlement =
    {


        ...settlement,


        sites:
        applyProfitStatus(
            settlement.sites || []
        ),



        distribution:
        {


            ...result.distribution,


            personal:
            result.personalDistribution


        },



        status:
        "FINALIZED",



        finalizedAt:
        new Date()
        .toISOString()



    };









    const existingHistory =
    getAllSettlements();









    const duplicate =
    existingHistory.find(
        item =>

        item.settlementId ===
        finalizedSettlement.settlementId

    );









    if(duplicate){



        alert(
            "This settlement already exists in history."
        );



        return false;



    }









    const saved =
    addSettlement(
        finalizedSettlement
    );









    if(!saved){



        alert(
            "Unable to finalize settlement. History save failed."
        );



        return false;



    }









    removeActiveSettlement();



    runSafetyBackup();



    return true;



}









/* =========================================
   Unlock Settlement

   Move Finalized To Active
========================================= */


function unlockSettlement(
    settlementId
){



    const settlements =
    getAllSettlements();








    const settlement =
    settlements.find(
        item =>

        item.settlementId === settlementId

    );








    if(!settlement){



        alert(
            "Settlement not found."
        );



        return false;



    }









    const confirmUnlock =
    confirm(
        "Unlock this finalized settlement for editing?"
    );








    if(!confirmUnlock){



        return false;



    }









    const editableSettlement =
    {


        ...settlement,


        status:
        "ACTIVE",



        finalizedAt:
        null



    };









    const saved =
    saveActiveSettlement(
        editableSettlement
    );









    if(!saved){



        alert(
            "Unable to unlock settlement."
        );



        return false;



    }









    const removed =
    deleteSettlement(
        settlementId
    );







    if(!removed){


        return false;


    }







    runSafetyBackup();



    return true;



}









/* =========================================
   Create New Site Object

========================================= */


function createSiteObject(
    name,
    amount,
    date
){



    const cleanName =
    String(name)
    .trim();








    const cleanAmount =
    validateAmount(
        amount
    );








    return {



        id:
        Date.now(),




        siteName:
        cleanName,




        amount:
        cleanAmount,




        entryDate:

        date
        ||
        new Date()
        .toISOString()
        .split("T")[0],




        profit:
        checkProfitStatus(
            cleanAmount
        )



    };



}









/* =========================================
   Apply Profit Status
========================================= */


function applyProfitStatus(
    sites=[]
){



    if(
        !Array.isArray(sites)
    ){


        return [];


    }








    return sites.map(
        site=>{


            const amount =
            validateAmount(
                site.amount
            );







            return {


                ...site,


                amount,


                profit:
                checkProfitStatus(
                    amount
                )


            };


        }

    );



}