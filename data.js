//Materials
//Called as mildSteel.soft.UTS

//UTS = ultimate tensile strength
//SSF = surface str fac
//BSF = bend str fac

var mildSteel = {
    soft: {
        UTS: 494000000,
        SSF: 10,
        BSF: 117,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 1.520,
                bending: 0.386,
            },
            B: {
                contact: 250,
                bending: 147,
            },
            contact: 490,
            bending: 110,
        }
    }
}

var EN8 = {
    norm: {
        UTS: 541000000,
        SSF: 10,
        BSF: 131,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 1.520,
                bending: 0.386,
            },
            B: {
                contact: 250,
                bending: 147,
            },
            contact: 110,
            bending: 110,
        }
    },
    HT: {
        UTS: 618000000,
        SSF: 14,
        BSF: 169,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0.951,
                bending: 0.286,
            },
            B: {
                contact: 345,
                bending: 167,
            },
            contact: 130,
            bending: 130,
        } 
    },
    SH: {
        UTS: 514000000,
        SSF: 19,
        BSF: 117,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0.951,
                bending: 0.286,
            },
            B: {
                contact: 345,
                bending: 167,
            },
            contact: 130,
            bending: 130,
        }
    }
}

var EN24 = {
    HT: {
        UTS: 849000000,
        SSF: 21,
        BSF: 231,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0.951,
                bending: 0.286,
            },
            B: {
                contact: 345,
                bending: 167,
            },
            contact: 130,
            bending: 130,
        } 
    },
    SH: {
        UTS: 8489000000,
        SSF: 35,
        BSF: 183,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0.951,
                bending: 0.286,
            },
            B: {
                contact: 345,
                bending: 167,
            },
            contact: 130,
            bending: 130,
        }
    }
}

var EN32 = {
    CH: {
        UTS: 494000000,
        SSF: 63,
        BSF: 276,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0,
                bending: 0,
            },
            B: {
                contact: 1650,
                bending: 525,
            },
            contact: 660,
            bending: 660,
        } 
    }
}

var EN34 = {
    CH: {
        UTS: 695000000,
        SSF: 72,
        BSF: 324,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0,
                bending: 0,
            },
            B: {
                contact: 1650,
                bending: 525,
            },
            contact: 660,
            bending: 660,
        } 
    }
}

var EN36 = {
    CH: {
        UTS: 849000000,
        SSF: 76,
        BSF: 345,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0,
                bending: 0,
            },
            B: {
                contact: 1650,
                bending: 525,
            },
            contact: 660,
            bending: 660,
        } 
    }
}

var EN39 = {
    CH: {
        UTS: 1313000000,
        SSF: 90,
        BSF: 345,
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0,
                bending: 0,
            },
            B: {
                contact: 1650,
                bending: 525,
            },
            contact: 660,
            bending: 660,
        } 
    }
}


//Module
const wheelTeethArray = Array.from(Array(800).keys())
const pinionTeethArray = Array.from(Array(120).keys())
const moduleArray = [0.1,0.2,0.3,0.4,0.5,0.6,0.8,1,1.25,1.5,2.0,2.5,3,4,5,6,8,10,12,16,20,25,32,40,50]


//Safety Factors
var sFMin = {
    ind: 1.4,
    crit: 1.6,
}

//ISO 6336 Load Factors
var Ky = 1

var Ka = 1.5

var Fy = new Array([10, 0.176],[11,0.192],[12,2.1],[13,0.223],[14,0.236],[15,0.245],[16,0.256],[17,0.264],[18,0.270],[19,0.277],[20,0.283],[22,0.292],[24,0.303],[26,0.308],[26,0.3308],[28,0.314],[30,0.318],[32,0.322],[34,0.325],[36,0.329],[38,0.332],[40,0.336],[45,0.340],[50,0.346],[55,0.352],[60,0.355],[65,0.358],[70,0.360],[75,0.361],[80,0.363],[90,0.366],[100,0.368],[150,0.375],[200,0.378],[300,0.382])