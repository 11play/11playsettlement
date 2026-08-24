/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Main Application Controller

   File:
   assets/js/app.js

   Final Production Version
========================================= */


/* =========================================
   Application Start
========================================= */


document.addEventListener(
    "DOMContentLoaded",
    function(){

        initializeApplication();

    }
);









/* =========================================
   Initialize Application
========================================= */


function initializeApplication(){


    try{


        loadCurrentSettlement();


        initializeSettlementButtons();


        initializeSiteButtons();


        initializeHistoryEvents();


        initializeBackup();


        initializePrint();


        renderSettlementHistory();



    }


    catch(error){


        console.error(
            "Application Initialization Error:",
            error
        );


        alert(
            "Application loading failed."
        );


    }


}









/* =========================================
   Load Current Settlement

   Active Settlement:
   Show Running Data

   No Active Settlement:
   Keep History Visible

========================================= */


function loadCurrentSettlement(){



    const settlement =
    getActiveSettlement();






    const dashboard =
    document.getElementById(
        "dashboard"
    );







    if(!dashboard){

        return;

    }







    dashboard.style.display =
    "block";







    if(settlement){



        updateDashboard(
            settlement
        );



    }


    else{


        clearRunningSettlementView();


    }



}









/* =========================================
   Clear Active Settlement View

========================================= */


function clearRunningSettlementView(){



    const fields = {


        settlementPeriod:
        "Not Started",


        settlementId:
        "-",


        settlementStatus:
        "NO ACTIVE",


        totalSite:
        "0",


        totalWithdrawal:
        "৳0.00",


        totalProfitSite:
        "0",


        finalTotalWithdrawal:
        "৳0.00",


        finalProfitCount:
        "0",


        engineeringAmount:
        "৳0.00",


        promotionAmount:
        "৳0.00",


        remainingAmount:
        "৳0.00",


        selimAmount:
        "৳0.00",


        faridAmount:
        "৳0.00",


        rafiqulAmount:
        "৳0.00"


    };







    Object.keys(fields)
    .forEach(id=>{


        const element =
        document.getElementById(
            id
        );



        if(element){


            element.innerText =
            fields[id];


        }



    });







    renderSiteTable([]);



}









/* =========================================
   Settlement Buttons
========================================= */


function initializeSettlementButtons(){



    const startBtn =
    document.getElementById(
        "startSettlementBtn"
    );







    if(startBtn){



        startBtn.onclick =
        function(){



            const start =
            prompt(
                "Enter Settlement Start Date (YYYY-MM-DD)"
            );







            const end =
            prompt(
                "Enter Settlement End Date (YYYY-MM-DD)"
            );







            if(!start || !end){


                return;


            }







            const settlement =
            createNewSettlement(
                start,
                end
            );







            if(settlement){



                alert(
                    "New settlement started successfully."
                );



                location.reload();



            }





        };



    }









    const finalizeBtn =
    document.getElementById(
        "finalizeSettlementBtn"
    );







    if(finalizeBtn){



        finalizeBtn.onclick =
        function(){



            const result =
            finalizeSettlement();







            if(result){



                alert(
                    "Settlement finalized successfully."
                );



                location.reload();



            }



        };



    }



}









/* =========================================
   Site Buttons
========================================= */


function initializeSiteButtons(){



    const addBtn =
    document.getElementById(
        "addSiteBtn"
    );







    if(!addBtn){

        return;

    }







    addBtn.onclick =
    function(){



        const settlement =
        getActiveSettlement();







        if(
            !isSettlementEditable(
                settlement
            )
        ){



            alert(
                "No active settlement available."
            );



            return;



        }







        const name =
        prompt(
            "Enter Site Name"
        );







        const amount =
        prompt(
            "Enter Withdrawal Amount"
        );







        const date =
        prompt(
            "Enter Entry Date YYYY-MM-DD"
        );







        if(
            !name
            ||
            amount === null
        ){

            return;

        }







        const saved =
        addSiteEntry(
            name,
            amount,
            date
        );







        if(saved){



            updateDashboard(
                getActiveSettlement()
            );



            runSafetyBackup();



        }



    };



}
/* =========================================
   Dashboard Update
========================================= */


function updateDashboard(
    settlement
){



    if(!settlement){

        return;

    }






    const result =
    calculateSettlementResult(
        settlement
    );







    function setText(
        id,
        value
    ){



        const element =
        document.getElementById(
            id
        );



        if(element){


            element.innerText =
            value ?? "-";


        }


    }







    setText(
        "settlementPeriod",

        formatDate(
            settlement.startDate
        )
        +
        " - "
        +
        formatDate(
            settlement.endDate
        )

    );







    setText(
        "settlementId",

        settlement.settlementId

    );







    setText(
        "settlementStatus",

        settlement.status

    );







    setText(
        "totalSite",

        result.totalSites

    );







    setText(
        "totalWithdrawal",

        formatCurrency(
            result.totalWithdrawal
        )

    );







    setText(
        "totalProfitSite",

        result.profitSites

    );







    setText(
        "finalTotalWithdrawal",

        formatCurrency(
            result.totalWithdrawal
        )

    );







    setText(
        "finalProfitCount",

        result.profitSites

    );







    setText(
        "engineeringAmount",

        formatCurrency(
            result.distribution?.engineeringCost || 0
        )

    );







    setText(
        "promotionAmount",

        formatCurrency(
            result.distribution?.promotionCost || 0
        )

    );







    setText(
        "remainingAmount",

        formatCurrency(
            result.distribution?.remainingDistribution || 0
        )

    );







    setText(
        "selimAmount",

        formatCurrency(
            result.personalDistribution?.["মো সেলিম"] || 0
        )

    );







    setText(
        "faridAmount",

        formatCurrency(
            result.personalDistribution?.["মোহাম্মদ ফরিদ"] || 0
        )

    );







    setText(
        "rafiqulAmount",

        formatCurrency(
            result.personalDistribution?.["রফিকুল ইসলাম"] || 0
        )

    );







    renderSiteTable(
        settlement.sites || []
    );



}









/* =========================================
   Site Table Render
========================================= */


function renderSiteTable(
    sites=[]
){



    const tbody =
    document.getElementById(
        "siteTableBody"
    );







    if(!tbody){

        return;

    }







    tbody.innerHTML = "";







    if(
        !Array.isArray(sites)
        ||
        sites.length === 0
    ){



        tbody.innerHTML = `


        <tr>

        <td colspan="5"
        style="text-align:center">

        No Site Entry

        </td>

        </tr>


        `;


        return;


    }







    const active =
    getActiveSettlement();







    sites.forEach(
        site=>{





            const row =
            document.createElement(
                "tr"
            );








            row.innerHTML = `



            <td>
            ${site.siteName || "-"}
            </td>



            <td>
            ${formatDate(site.entryDate)}
            </td>



            <td>
            ${formatCurrency(site.amount || 0)}
            </td>



            <td>
            ${
                site.profit
                ?
                "✓"
                :
                "-"
            }
            </td>



            <td>

            ${
                active
                &&
                active.status==="ACTIVE"

                ?

                `<button 
                class="delete-site-btn"
                data-id="${site.id}">
                Delete
                </button>`

                :

                "LOCKED"

            }


            </td>


            `;







            tbody.appendChild(
                row
            );



        }

    );








    document
    .querySelectorAll(
        ".delete-site-btn"
    )
    .forEach(
        button=>{


            button.onclick =
            function(){



                const id =
                this.dataset.id;







                if(
                    confirm(
                    "Delete this site entry?"
                    )
                ){



                    deleteSiteEntry(
                        id
                    );



                    updateDashboard(
                        getActiveSettlement()
                    );



                    runSafetyBackup();



                }



            };


        }

    );



}









/* =========================================
   History Events
========================================= */


function initializeHistoryEvents(){



    const search =
    document.getElementById(
        "historySearch"
    );







    const filter =
    document.getElementById(
        "historyStatusFilter"
    );








    function refreshHistory(){



        renderSettlementHistory(

            search
            ?
            search.value
            :
            "",



            filter
            ?
            filter.value
            :
            ""

        );



    }








    if(search){



        search.addEventListener(
            "input",
            refreshHistory
        );



    }








    if(filter){



        filter.addEventListener(
            "change",
            refreshHistory
        );



    }



}