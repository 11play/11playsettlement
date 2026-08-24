/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Settlement History Management

   File:
   assets/js/history.js

   Production Version
========================================= */



/* =========================================
   Get Settlement History
========================================= */


function getSettlementHistory(){


    const history =
    getAllSettlements();




    return Array.isArray(history)

    ?

    history

    :

    [];


}









/* =========================================
   Format Date
========================================= */


function formatDate(date){



    if(!date){

        return "-";

    }






    const d =
    new Date(date);







    if(
        isNaN(
            d.getTime()
        )
    ){

        return "-";

    }








    return d.toLocaleDateString(

        "en-GB",

        {

            day:
            "2-digit",


            month:
            "short",


            year:
            "numeric"


        }

    );


}









/* =========================================
   Search Settlement History
========================================= */


function searchSettlementHistory(
    keyword=""
){



    const history =
    getSettlementHistory();







    keyword =
    String(keyword)
    .toLowerCase()
    .trim();







    if(!keyword){

        return history;

    }







    return history.filter(
        settlement=>{



            const searchable = [

                settlement.settlementId,

                settlement.startDate,

                settlement.endDate,

                settlement.status


            ]
            .join(" ")
            .toLowerCase();







            return searchable.includes(
                keyword
            );


        }

    );


}









/* =========================================
   Filter History By Status
========================================= */


function filterSettlementByStatus(
    status=""
){



    const history =
    getSettlementHistory();







    if(!status){

        return history;

    }







    return history.filter(
        settlement =>

        settlement.status === status

    );


}









/* =========================================
   Combined History Filter
========================================= */


function getFilteredHistory(
    keyword="",
    status=""
){



    let result =
    getSettlementHistory();







    if(keyword){



        result =
        searchSettlementHistory(
            keyword
        );


    }







    if(status){



        result =
        result.filter(
            settlement =>

            settlement.status === status

        );


    }







    return result;


}









/* =========================================
   Render Settlement History
========================================= */


function renderSettlementHistory(
    keyword="",
    status=""
){



    const tbody =
    document.getElementById(
        "historyTableBody"
    );







    if(!tbody){

        return;

    }







    let history =

    getFilteredHistory(
        keyword,
        status
    );







    history.sort(
        (a,b)=>{


            return new Date(
                b.createdAt || 0
            )
            -
            new Date(
                a.createdAt || 0
            );


        }

    );







    tbody.innerHTML = "";







    if(
        history.length === 0
    ){


        tbody.innerHTML = `

        <tr>

        <td colspan="6"
        style="
        text-align:center;
        padding:20px;
        ">

        No settlement history available

        </td>

        </tr>

        `;


        return;


    }







    history.forEach(
        settlement=>{



            const result =

            calculateSettlementResult(
                settlement
            );








            const row =

            document.createElement(
                "tr"
            );








            row.innerHTML = `


            <td>
            ${

                settlement.settlementId
                ||
                "-"

            }

            </td>




            <td>

            ${
                formatDate(
                    settlement.startDate
                )
            }

            -

            ${
                formatDate(
                    settlement.endDate
                )
            }


            </td>





            <td>

            ${
                result.totalSites
            }

            </td>





            <td>

            ${
                formatCurrency(
                    result.totalWithdrawal
                )
            }

            </td>





            <td>

            <strong>

            ${
                settlement.status
                ||
                "-"
            }

            </strong>


            </td>





            <td>

            <button
            class="view-settlement-btn">
            View
            </button>



            <button
            class="print-settlement-btn">
            Print
            </button>


            </td>


            `;







            row
            .querySelector(
                ".view-settlement-btn"
            )
            .addEventListener(
                "click",
                ()=>{


                    viewSettlement(
                        settlement.settlementId
                    );


                }

            );







            row
            .querySelector(
                ".print-settlement-btn"
            )
            .addEventListener(
                "click",
                ()=>{


                    printSettlement(
                        settlement.settlementId
                    );


                }

            );







            tbody.appendChild(
                row
            );


        }

    );


}
/* =========================================
   Find Settlement By ID
========================================= */


function findSettlementById(
    settlementId
){



    const history =
    getSettlementHistory();







    return history.find(

        settlement =>

        settlement.settlementId === settlementId

    )
    ||
    null;


}









/* =========================================
   View Settlement Preview
========================================= */


function viewSettlement(
    settlementId
){



    const settlement =

    findSettlementById(
        settlementId
    );







    if(!settlement){



        alert(
            "Settlement not found."
        );



        return false;


    }








    window.currentViewingSettlement =
    settlement;



    window.printingSettlement =
    settlement;








    if(
        typeof generatePrintDocument ===
        "function"
    ){


        generatePrintDocument(
            settlement
        );


    }








    const printArea =

    document.getElementById(
        "printDocument"
    );








    if(printArea){



        printArea.style.display =
        "block";







        setTimeout(
            ()=>{


                printArea.scrollIntoView({

                    behavior:
                    "smooth",


                    block:
                    "start"


                });


            },
            200
        );


    }







    return true;


}









/* =========================================
   Print Settlement
========================================= */


function printSettlement(
    settlementId
){



    const settlement =

    findSettlementById(
        settlementId
    );







    if(!settlement){



        alert(
            "Settlement not found."
        );



        return false;


    }








    window.printingSettlement =
    settlement;







    if(
        typeof generatePrintDocument ===
        "function"
    ){



        generatePrintDocument(
            settlement
        );


    }








    setTimeout(
        ()=>{


            window.print();



        },

        500

    );








    return true;


}









/* =========================================
   Delete History Settlement
========================================= */


function deleteHistorySettlement(
    settlementId
){



    const confirmDelete =

    confirm(

        "Are you sure you want to delete this settlement history?"

    );







    if(!confirmDelete){


        return false;


    }







    const deleted =

    deleteSettlement(
        settlementId
    );







    if(deleted){



        renderSettlementHistory();


    }







    return deleted;


}









/* =========================================
   Latest Settlement
========================================= */


function getLatestSettlement(){



    const history =
    getSettlementHistory();







    if(
        history.length === 0
    ){

        return null;

    }







    return history.sort(

        (a,b)=>

        new Date(
            b.createdAt || 0
        )

        -

        new Date(
            a.createdAt || 0
        )

    )[0];


}









/* =========================================
   History Statistics
========================================= */


function getHistoryStatistics(){



    const history =
    getSettlementHistory();







    let finalized = 0;

    let active = 0;

    let totalSites = 0;

    let totalWithdrawal = 0;







    history.forEach(
        settlement=>{





            if(
                settlement.status ===
                "FINALIZED"
            ){

                finalized++;

            }







            if(
                settlement.status ===
                "ACTIVE"
            ){

                active++;

            }







            const result =

            calculateSettlementResult(
                settlement
            );







            totalSites +=

            result.totalSites;







            totalWithdrawal +=

            result.totalWithdrawal;



        }

    );








    return {


        total:
        history.length,


        finalized,


        active,


        totalSites,


        totalWithdrawal


    };


}









/* =========================================
   Initialize History
========================================= */


function initializeHistory(){


    renderSettlementHistory();


}