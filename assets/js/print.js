/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Official Print Document Generator

   File:
   assets/js/print.js

   Production Replacement Version
========================================= */


/* =========================================
   Generate Print Document

   Creates Official Settlement Memo
========================================= */


function generatePrintDocument(
    settlement
){


    if(!settlement){


        alert(
            "No settlement selected."
        );


        return false;


    }






    const container =
    document.getElementById(
        "printSettlementContent"
    );





    const printBox =
    document.getElementById(
        "printDocument"
    );





    if(!container){


        console.error(
            "Print container missing."
        );


        return false;


    }






    const result =
    calculateSettlementResult(
        settlement
    );






    const distribution =
    result.distribution
    ||
    {};






    const personal =
    result.personalDistribution
    ||
    {};







    let siteRows = "";






    if(
        Array.isArray(
            settlement.sites
        )
        &&
        settlement.sites.length > 0
    ){



        settlement.sites.forEach(
            site=>{


                siteRows += `


                <tr>


                    <td>
                    ${
                        site.siteName
                        ||
                        "-"
                    }
                    </td>




                    <td>
                    ${
                        formatDate(
                            site.entryDate
                        )
                    }
                    </td>





                    <td>
                    ${
                        formatCurrency(
                            site.amount
                        )
                    }
                    </td>





                    <td>

                    ${
                        site.profit
                        ?
                        "PROFIT"
                        :
                        "-"
                    }

                    </td>



                </tr>


                `;


            }

        );


    }

    else{


        siteRows = `


        <tr>


            <td
            colspan="4"
            style="
            text-align:center;
            padding:15px;
            ">


            No Site Entry Available


            </td>


        </tr>


        `;


    }








    container.innerHTML = `


<div class="official-document">





<div class="print-watermark">


<img

src="assets/images/11play-logo-watermark.png"

alt="11Play Watermark">

</div>







<header class="document-header">



<img

src="assets/images/11play-logo.png"

class="document-logo"

alt="11Play Logo">






<h1>
11PLAY
</h1>





<h2>
WEEKLY SETTLEMENT STATEMENT
</h2>





<p>
Official Financial Settlement Memo
</p>





</header>









<hr>









<section class="document-section">


<h3>
Settlement Information
</h3>






<table>



<tr>


<td>
Settlement ID
</td>



<td>

${
settlement.settlementId
||
"-"
}

</td>



</tr>







<tr>


<td>
Settlement Period
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



</tr>







<tr>


<td>
Status
</td>



<td>

${
settlement.status
||
"-"
}

</td>



</tr>







<tr>


<td>
Finalization Date
</td>



<td>

${
formatDate(
settlement.finalizedAt
)
}

</td>



</tr>





</table>



</section>









<section class="document-section">


<h3>
Site Summary
</h3>






<table>



<thead>


<tr>



<th>
Site Name
</th>



<th>
Entry Date
</th>



<th>
Withdrawal
</th>



<th>
Profit Status
</th>



</tr>


</thead>






<tbody>


${siteRows}


</tbody>






</table>





</section>








<section class="document-section">


<h3>
Overall Summary
</h3>






<table>



<tr>


<td>
Total Site
</td>



<td>

${

result.totalSites

}

</td>



</tr>







<tr>


<td>
Total Withdrawal
</td>



<td>


${

formatCurrency(
result.totalWithdrawal
)

}


</td>



</tr>







<tr>


<td>
Total Profit Sites
</td>



<td>


${

result.profitSites

}


</td>



</tr>







</table>





</section>


`;
/* =========================================
   Continue Generate Print Document
========================================= */


container.innerHTML += `



<section class="document-section">


<h3>
Cost Distribution
</h3>





<table>



<tr>


<td>
Engineering Cost
</td>



<td>
20%
</td>



<td>

${
formatCurrency(
distribution.engineeringCost || 0
)
}

</td>



</tr>







<tr>


<td>
Promotion Cost
</td>



<td>
20%
</td>



<td>

${
formatCurrency(
distribution.promotionCost || 0
)
}

</td>



</tr>







<tr>


<td>
Remaining Distribution
</td>



<td>
60%
</td>



<td>

${
formatCurrency(
distribution.remainingDistribution || 0
)
}

</td>



</tr>






</table>





</section>









<section class="document-section">


<h3>
Individual Distribution
</h3>






<table>





<tr>


<td>
মো সেলিম
</td>



<td>
20%
</td>



<td>

${
formatCurrency(
personal["মো সেলিম"] || 0
)
}

</td>



</tr>







<tr>


<td>
মোহাম্মদ ফরিদ
</td>



<td>
20%
</td>



<td>

${
formatCurrency(
personal["মোহাম্মদ ফরিদ"] || 0
)
}

</td>



</tr>







<tr>


<td>
রফিকুল ইসলাম
</td>



<td>
20%
</td>



<td>

${
formatCurrency(
personal["রফিকুল ইসলাম"] || 0
)
}

</td>



</tr>






</table>





</section>









<section class="signature-section">


<h3>
Received / Acknowledged By
</h3>






<div class="signature-box">


<strong>
মো সেলিম
</strong>



<p>
Signature: ______________________
</p>



<p>
Date: ___________________________
</p>


</div>









<div class="signature-box">


<strong>
মোহাম্মদ ফরিদ
</strong>



<p>
Signature: ______________________
</p>



<p>
Date: ___________________________
</p>


</div>









<div class="signature-box">


<strong>
রফিকুল ইসলাম
</strong>



<p>
Signature: ______________________
</p>



<p>
Date: ___________________________
</p>


</div>







</section>









<footer class="document-footer">


<p>

Generated by 11Play Weekly Settlement System

</p>




<p>

Generated Date:

${
formatDate(
new Date()
)
}

</p>




</footer>







</div>


`;









/* =========================================
   Show Preview
========================================= */


if(printBox){


    printBox.style.display =
    "block";


}



window.currentViewingSettlement =
settlement;


window.printingSettlement =
settlement;




return true;



}









/* =========================================
   Set Printing Settlement
========================================= */


function setPrintingSettlement(
    settlement
){


    window.printingSettlement =
    settlement;


}









/* =========================================
   Print Current Settlement
========================================= */


function printCurrentSettlement(){


    const settlement =
    window.printingSettlement;





    if(!settlement){


        alert(
            "No settlement selected."
        );


        return false;


    }






    generatePrintDocument(
        settlement
    );






    setTimeout(
        function(){


            window.print();


        },
        500
    );



}









/* =========================================
   Download Settlement Memo
========================================= */


function downloadSettlementPDF(){


    const settlement =
    window.printingSettlement;





    if(!settlement){


        alert(
            "No settlement selected."
        );


        return false;


    }







    generatePrintDocument(
        settlement
    );







    const content =

    document.getElementById(
        "printSettlementContent"
    )
    .innerHTML;








    const fullDocument = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">


<title>
11Play Settlement Memo
</title>


<style>

body{

font-family:Arial,sans-serif;

padding:30px;

}



table{

width:100%;

border-collapse:collapse;

}



td,th{

border:1px solid #ccc;

padding:8px;

}



h1,h2,h3{

text-align:center;

}


</style>


</head>


<body>


${content}


</body>


</html>

`;








    const blob =

    new Blob(
        [
            fullDocument
        ],
        {

            type:
            "text/html"

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







    link.href = url;





    link.download =

    settlement.settlementId

    +

    "-Settlement-Memo.html";








    document.body.appendChild(
        link
    );





    link.click();





    document.body.removeChild(
        link
    );






    URL.revokeObjectURL(
        url
    );



}









/* =========================================
   Close Preview
========================================= */


function closePrintPreview(){



    const printBox =

    document.getElementById(
        "printDocument"
    );






    if(printBox){


        printBox.style.display =
        "none";


    }


}









/* =========================================
   Initialize Print
========================================= */


function initializePrint(){



    const printBtn =

    document.getElementById(
        "printSettlementPreviewBtn"
    );







    if(printBtn){


        printBtn.onclick =

        function(){


            printCurrentSettlement();


        };


    }








    const downloadBtn =

    document.getElementById(
        "downloadSettlementBtn"
    );








    if(downloadBtn){



        downloadBtn.onclick =

        function(){


            downloadSettlementPDF();


        };


    }








    const closeBtn =

    document.getElementById(
        "closePrintPreviewBtn"
    );








    if(closeBtn){



        closeBtn.onclick =

        function(){


            closePrintPreview();


        };


    }



}