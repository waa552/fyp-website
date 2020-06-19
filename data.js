//Materials
//Called as mildSteel.soft.UTS

//UTS = ultimate tensile strength
//SSF = surface str fac
//BSF = bend str fac

const normLowCarb = {
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
    },
}
const normLowCarbMax = {
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
        contact: 210,
        bending: 210,
    }
}


const normLowCast = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 1.143,
            bending: 0.254,
        },
        B: {
            contact: 237,
            bending: 137,
        },
        contact: 140,
        bending: 140,
    },
}

const normLowCastMax = {
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 1.143,
                bending: 0.254,
            },
            B: {
                contact: 250,
                bending: 147,
            },
            contact: 210,
            bending: 210,
        }
}

const thrHardWro = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0.838,
            bending: 0.283,
        },
        B: {
            contact: 432,
            bending: 202,
        },
        contact: 135,
        bending: 135,
    },
}
const thrHardWroMax = {
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 0.838,
                bending: 0.283,
            },
            B: {
                contact: 432,
                bending: 202,
            },
            contact: 210,
            bending: 210,
        }
}

const thrHardWroAlloy = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 2.213,
            bending: 0.358,
        },
        B: {
            contact: 260,
            bending: 231,
        },
        contact: 200,
        bending: 200,
    }
}
const thrHardWroAlloyMax = {
        density: 7.86e-6,
        E: 206e3,
        hardness: {
            A: {
                contact: 2.213,
                bending: 0.358,
            },
            B: {
                contact: 260,
                bending: 231,
            },
            contact: 390,
            bending: 390,
        }
}

const thrHardCast = {
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
const thrHardCastMax = {
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
        contact: 215,
        bending: 215,
    }
}

const thrHardCastAlloy = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 1.350,
            bending: 0.356,
        },
        B: {
            contact: 356,
            bending: 186,
        },
        contact: 200,
        bending: 200,
    }
}
const thrHardCastAlloyMax = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 1.350,
            bending: 0.356,
        },
        B: {
            contact: 356,
            bending: 186,
        },
        contact: 360,
        bending: 360,
    }
}

const caseHardWro = {
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
const caseHardWromax = {
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
        contact: 800,
        bending: 800,
    }
}

const flameHardWro = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0.505,
            bending: 0.271,
        },
        B: {
            contact: 1013,
            bending: 237,
        },
        contact: 500,
        bending: 500,
    }
}
const flameHardWroMax = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0.505,
            bending: 0.271,
        },
        B: {
            contact: 1013,
            bending: 237,
        },
        contact: 615,
        bending: 615,
    }
}

const nitWro = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 1450,
            bending: 468,
        },
        contact: 650,
        bending: 650,
    }
}
const nitWroMax = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 1450,
            bending: 468,
        },
        contact: 900,
        bending: 900,
    }
}

const nitWroThr = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 1217,
            bending: 432,
        },
        contact: 450,
        bending: 450,
    }
}
const nitWroThrMax = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 1217,
            bending: 432,
        },
        contact: 650,
        bending: 650,
    }
}

const wroNitCarb = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 950,
            bending: 388,
        },
        contact: 450,
        bending: 450,
    }
}
const wroNitCarbMax = {
    density: 7.86e-6,
    E: 206e3,
    hardness: {
        A: {
            contact: 0,
            bending: 0,
        },
        B: {
            contact: 950,
            bending: 388,
        },
        contact: 650,
        bending: 650,
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