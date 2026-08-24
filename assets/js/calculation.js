/* =========================================
   11PLAY WEEKLY SETTLEMENT

   Financial Calculation System

   File:
   assets/js/calculation.js

   Final Production Version
========================================= */


/* =========================================
   Calculation Configuration
========================================= */


const SETTLEMENT_PERCENTAGE = {


    engineering:
    0.20,


    promotion:
    0.20,


    remaining:
    0.60


};









/* =========================================
   Currency Formatter

   Output:
   ৳100,000.00
========================================= */


function formatCurrency(amount){


    const value =
    validateAmount(amount);



    return "৳" +
    value.toLocaleString(
        "en-BD",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );


}









/* =========================================
   Number Rounding Helper
========================================= */


function roundAmount(value){


    return Math.round(
        (Number(value) || 0)
        * 100
    )
    /
    100;


}









/* =========================================
   Validate Amount

   Negative Value Not Allowed
========================================= */


function validateAmount(amount){


    const value =
    Number(amount);



    if(
        isNaN(value)
        ||
        value < 0
    ){

        return 0;

    }



    return roundAmount(value);


}









/* =========================================
   Calculate Total Withdrawal
========================================= */


function calculateTotalWithdrawal(
    sites=[]
){



    if(
        !Array.isArray(sites)
    ){

        return 0;

    }







    let total = 0;



    sites.forEach(
        site=>{


            total += validateAmount(
                site?.amount
            );


        }

    );




    return roundAmount(total);


}









/* =========================================
   Count Total Sites
========================================= */


function calculateTotalSites(
    sites=[]
){


    return Array.isArray(sites)
    ?
    sites.length
    :
    0;


}









/* =========================================
   Profit Logic

   Amount > 0 = TRUE
========================================= */


function checkProfitStatus(
    amount
){



    return (

        validateAmount(
            amount
        )

        >

        0

    );


}









/* =========================================
   Count Profit Sites
========================================= */


function calculateProfitSites(
    sites=[]
){



    if(
        !Array.isArray(sites)
    ){

        return 0;

    }







    let count = 0;



    sites.forEach(
        site=>{



            if(
                site.profit === true
                ||
                checkProfitStatus(
                    site.amount
                )
            ){

                count++;


            }



        }

    );



    return count;


}









/* =========================================
   Distribution Calculation

   Engineering = 20%
   Promotion   = 20%
   Remaining   = 60%

========================================= */


function calculateDistribution(
    total
){



    total =
    validateAmount(
        total
    );




    return {


        engineeringCost:

        roundAmount(
            total *
            SETTLEMENT_PERCENTAGE.engineering
        ),



        promotionCost:

        roundAmount(
            total *
            SETTLEMENT_PERCENTAGE.promotion
        ),



        remainingDistribution:

        roundAmount(
            total *
            SETTLEMENT_PERCENTAGE.remaining
        )


    };


}









/* =========================================
   Three Person Distribution

   Remaining 60% / 3

========================================= */


function calculatePersonalDistribution(
    total
){



    total =
    validateAmount(
        total
    );



    const remaining =

    roundAmount(

        total *
        SETTLEMENT_PERCENTAGE.remaining

    );



    const eachPerson =

    roundAmount(

        remaining / 3

    );




    return {


        "মো সেলিম":

        eachPerson,



        "মোহাম্মদ ফরিদ":

        eachPerson,



        "রফিকুল ইসলাম":

        eachPerson


    };


}
/* =========================================
   Complete Settlement Calculation
========================================= */


function calculateSettlementResult(
    settlement
){



    if(!settlement){


        return {


            totalSites:

            0,



            totalWithdrawal:

            0,



            profitSites:

            0,



            distribution:

            calculateDistribution(
                0
            ),



            personalDistribution:

            calculatePersonalDistribution(
                0
            )


        };


    }






    const sites =

    Array.isArray(
        settlement.sites
    )

    ?

    settlement.sites

    :

    [];







    const totalWithdrawal =

    calculateTotalWithdrawal(
        sites
    );







    return {



        totalSites:

        calculateTotalSites(
            sites
        ),





        totalWithdrawal:

        totalWithdrawal,





        profitSites:

        calculateProfitSites(
            sites
        ),





        distribution:

        calculateDistribution(
            totalWithdrawal
        ),





        personalDistribution:

        calculatePersonalDistribution(
            totalWithdrawal
        )



    };


}









/* =========================================
   Validate Settlement Consistency

   Ensures:
   20 + 20 + 60 = 100%
========================================= */


function validateDistribution(
    result
){



    if(
        !result
        ||
        !result.distribution
    ){

        return false;

    }






    const distribution =
    result.distribution;







    const calculatedTotal =


        validateAmount(
            distribution.engineeringCost
        )

        +

        validateAmount(
            distribution.promotionCost
        )

        +

        validateAmount(
            distribution.remainingDistribution
        );







    return (


        roundAmount(
            calculatedTotal
        )


        ===


        roundAmount(
            result.totalWithdrawal
        )


    );


}









/* =========================================
   Validate Personal Distribution
========================================= */


function validatePersonalDistribution(
    result
){



    if(
        !result
        ||
        !result.personalDistribution
    ){

        return false;

    }








    const personal =
    result.personalDistribution;







    const total =


        validateAmount(
            personal["মো সেলিম"]
        )

        +

        validateAmount(
            personal["মোহাম্মদ ফরিদ"]
        )

        +

        validateAmount(
            personal["রফিকুল ইসলাম"]
        );







    return (


        roundAmount(
            total
        )


        ===


        roundAmount(
            result.totalWithdrawal *
            SETTLEMENT_PERCENTAGE.remaining
        )


    );



}









/* =========================================
   Attach Profit Status To Sites

   Before Save
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
