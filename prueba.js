const moment = require('moment');

//washa

let hoy = moment(); //al ejecutar moment nos returna un obejeto de tipo moment 
console.log(hoy) //=   moment("2018-11-24T19:14:45.347")

/**
 * EJEMPLOS DE METODOS INCLUIDOS EN MOMENT
 * 
 * con los objetos moment tambien de puede acceder a estos metodos
 */



//Formato de fecha
let prueba = moment().format('YYYY-MM-DD') 
console.log(prueba) // = 2018-11-24
prueba = moment().format('YYYY-MM-DD HH:mm:ss')
console.log(prueba) // = 2018-11-24 19:17:45
moment().format('MMMM Do YYYY, h:mm:ss a'); // November 24th 2018, 7:18:43 pm
moment().format('dddd');                    // Saturday
moment().format("MMM Do YY");               // Nov 24th 18
moment().format('YYYY [escaped] YYYY');     // 2018 escaped 2018
moment().format();                          // 2018-11-24T19:18:43-07:00
//Tiempos relativos
moment("20111031", "YYYYMMDD").fromNow(); // 7 years ago
moment("20120620", "YYYYMMDD").fromNow(); // 6 years ago
moment().startOf('day').fromNow();        // 19 hours ago
moment().endOf('day').fromNow();          // in 5 hours
moment().startOf('hour').fromNow();       // 19 minutes ago
//Tiempos de calendario
moment().subtract(10, 'days').calendar(); // 11/14/2018
moment().subtract(6, 'days').calendar();  // Last Sunday at 7:18 PM
moment().subtract(3, 'days').calendar();  // Last Wednesday at 7:18 PM
moment().subtract(1, 'days').calendar();  // Yesterday at 7:18 PM
moment().calendar();                      // Today at 7:18 PM
moment().add(1, 'days').calendar();       // Tomorrow at 7:18 PM
moment().add(3, 'days').calendar();       // Tuesday at 7:18 PM
moment().add(10, 'days').calendar();      // 12/04/2018

//Cambiar localidad
moment.locale();         // en
moment().format('LT');   // 7:19 PM
moment().format('LTS');  // 7:19:50 PM
moment().format('L');    // 11/24/2018
moment().format('l');    // 11/24/2018
moment().format('LL');   // November 24, 2018
moment().format('ll');   // Nov 24, 2018
moment().format('LLL');  // November 24, 2018 7:19 PM
moment().format('lll');  // Nov 24, 2018 7:19 PM
moment().format('LLLL'); // Saturday, November 24, 2018 7:19 PM
moment().format('llll'); // Sat, Nov 24, 2018 7:19 PM


//doc:  https://momentjs.com/docs/#/query/


 
