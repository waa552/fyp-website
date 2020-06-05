//File Contains functions to be run with run.js
//

function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML
    var originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
}

// function teethNumFind2(ratioMin, ratioMax, teethMin, wheelTeethMax, pinionTeethMax) {
//     var pinionTeethMin = teethMin
//     var wheelTeethMin = teethMin
//     var wheelTeethArray = []
//     var pinionTeethArray = []
//     var ratioArray = []
//     var k=0

//     for (let i = pinionTeethMin; i < pinionTeethMax; i++) {
//         for (let j = wheelTeethMin; j < wheelTeethMax; j++) {
//            let ratio = wheelTeeth/pinionTeeth 
//            console.log(ratio)
//            if ((ratio>=ratioMin) && (ratio<=ratioMax)) {
//                wheelTeethArray.push(j)
//                pinionTeethArray.push(i)
//                ratioArray.push(j/i)
//            } else {
//                continue;
//            }
//         }
//     return {
//         newWheelArray: wheelTeethArray,
//         newPinionArray: pinionTeethArray,
//         newRatioArray: ratioArray
//     }
// }

function materialGet() {
        // eval() is used as the only strings come from the drop down options
    var e = document.getElementById("materialSelection")
    var material = e.options[e.selectedIndex].value
    var material = eval(material)
    return material
}

function tolerances(gearGeom, module, quality, sigma_hlim) {
        //ISO 1328-1:2013 5.3.3
    var ffa = ((0.55*module + 5)*(Math.sqrt(2)**(quality-5)))
    var fp = ((0.001*gearGeom.pinion.pitch + 0.4*module + 5)*(Math.sqrt(2)**(quality-5)))
        //ya = yp, ya = yf
    var ya = (160/(sigma_hlim))*fp

    var ffa_eff = ffa-ya
    var fp_eff = fp-ya
    
    return {
        ffa_eff: ffa_eff,
        fpb_eff: fp_eff,
    }
}

function fquality() {
    var e = document.getElementById("materialSelection")
    if (e === 'cut') {
        quality = 5
    } else {
        quality = 8
    }
    return quality
}

function profileShiftGet() {
    var pinion = parseFloat(document.getElementById("pinionShiftCoeff").value) || 0
    var wheel = parseFloat(document.getElementById("wheelShiftCoeff").value) || 0 
    return {
        pinion: pinion,
        wheel: wheel
    }
}

function angleGet() {
    var pressureAngle = parseFloat(document.getElementById('pressureAngle').value) || 20
    var pressureAngleRad = pressureAngle * Math.PI / 180
    var helixAngle = parseFloat(document.getElementById('helixAngle').value) || 0
    var helixAngleRad = helixAngle * Math.PI / 180
    return {
        pressure: {
            deg: pressureAngle,
            rad: pressureAngleRad
        },
        helix: {
            deg: helixAngle,
            rad: helixAngleRad
        },
    }
}

function ratioFind() {
    //takes input ratios and tolerances and calcs the ratio boundaries
   var ratioIdeal = parseFloat(document.getElementById('ratioIdeal').value) || 0
   var ratioTolLow = parseFloat(document.getElementById('ratioTolLow').value) || 0
   var ratioTolUp = parseFloat(document.getElementById('ratioTolUp').value) || 0
   
   var ratioMin = ratioIdeal - ratioTolLow
   var ratioMax = ratioIdeal + ratioTolUp
   
   document.getElementById("ratio0Num").innerHTML = ratioIdeal
   document.getElementById("ratioMinNum").innerHTML = Math.round(ratioMin*1000)/1000
   document.getElementById("ratioMaxNum").innerHTML = Math.round(ratioMax*1000)/1000
   
   return {
       target: ratioIdeal,
       min: ratioMin,
       max: ratioMax
   }
}

function minTeethFind(angle, ratio0) {
    var minTeeth = Math.round(2/(0.5- 0.5*Math.cos(2*angle.pressure.rad)))
    return {
        pinion: minTeeth,
        wheel: Math.ceil(minTeeth*ratio0.min)
    }
}

function centreDistCalc(module, z) {
    var a = module*(z.pinion+z.wheel)/2
    return a
}

function contactRatioTeeth(angle, a0, z, b) {
    var {ratio, z} = ratioCheck(z)
    var module = Math.floor(2*a0.ideal/(z.pinion+z.wheel))
    var a = centreDistCalc(module, z)

    var ratio = z.wheel/z.pinion
    var {a, z, module} = centreDistCheck(a, a0, z, ratio, module)
    var gearGeom = gearDims(module, z, angle, a)
    var epsil = contactRatioFind(module, z, angle, gearGeom, a, b)
    while (epsil.y < 1.2) {
        module--
        var a = centreDistCalc(module, z)
        var ratio = z.wheel/z.pinion
        var {a, z, module} = centreDistCheck(a, a0, z, ratio, module)
        var {ratio, z} = ratioCheck(z)
    }

    return {
        a: a,
        z: z,
        module: module,
        epsil: epsil,
        ratio: ratio,
    }
}


function centreDistCheck(a, a0, z, ratio, module) {
    while (a < a0.min) {
        z.wheel++
        var {ratio, z} = ratioCheck(z)
        a = centreDistCalc(module, z)
        if (a > a0.max) {
            module--
            var zsum = 2*a/module
            z.pinion = Math.round(zsum/(ratio+1))
            z.wheel = Math.round(zsum-z.pinion)
            var {ratio, z} = ratioCheck(ratio, z)
            a = centreDistCalc(module,z)
        }
    }
    return {
        a: a,
        z: z,
        module: module
    }
}


function ratioCheck(z) {
        //takes minimum teeth number and uses ratio boundaries to calc ideal ratio
    var ratio = z.wheel/z.pinion
    var ratioIdeal = parseFloat(document.getElementById('ratioIdeal').value)
    var ratioMin = ratioIdeal - parseFloat(document.getElementById('ratioTolLow').value)
    var ratioMax = ratioIdeal + parseFloat(document.getElementById('ratioTolUp').value)
    while (ratio <= ratioMin) {
        z.wheel++
        if (z.wheel > 800) {
            alert('No feasible wheel teeth numbers, please increase tolerances or lower ideal ratio')
            break
        }
        ratio = z.wheel/z.pinion
        while (ratio > ratioMax) {
            z.pinion++
            ratio = z.wheel/z.pinion
            if (pinionTeeth > 120) {
                alert('No feasible pinion teeth numbers, please increase tolerances or lower ideal ratio')
                break
            }
        }
    }
    return {
        ratio: z.wheel/z.pinion,
        z: z
    }
}

function centreDistGet() {
    var centreDist = parseFloat(document.getElementById('a0').value)
    var aTolLow = parseFloat(document.getElementById('aTolLow').value) || 0
    var aTolUp = parseFloat(document.getElementById('aTolUp').value) || 0

    document.getElementById('a0').innerHTML = Math.floor(centreDist*1000)/1000
    document.getElementById('aMin').innerHTML = centreDist - aTolLow
    document.getElementById('aMax').innerHTML = centreDist + aTolUp

    return {
        ideal: centreDist,
        min: centreDist - aTolLow,
        max: centreDist + aTolUp,
    }
}

function modLims(a, z) {
    var moduleMin = (2*a.min)/(z.wheel+z.pinion)
    var moduleMax = (2*a.max)/(z.wheel+z.pinion) 
    // document.getElementById('moduleMin').innerHTML = Math.ceil(moduleMin*10000)/10000
    // document.getElementById('moduleMax').innerHTML = Math.floor(moduleMax*10000)/10000
    return {
        min: moduleMin,
        max: moduleMax,
    }
}

//Filter function to find the possible modules
function moduleGet(inputVal) {
    return (inputVal >= moduleMin) && (inputVal <= moduleMax)
}

function checkIfMod(moduleMin, moduleMax) {
    var moduleInput = parseFloat(document.getElementById('moduleInput').value)
    if (typeof moduleInput === 'undefined' || isNaN(moduleInput) === true) {
        var modulePrompt = prompt("Please select a module within the minimum and maximum modules", Math.ceil(moduleMin*10000)/10000)
        var module = parseFloat(modulePrompt)
    } else {
        module = moduleInput
    }
    if (moduleInput < moduleMin || moduleInput > moduleMax) {
        alert("Pre-selected module is not possible with the surrent setup. Please select a new module or increase tolerances")
    }
    return module
}

function gearDims(module, z, angle, a){
    var y = (a/module)-((z.wheel+z.pinion)/2)
    var aWork = (((z.pinion+z.wheel)/2)+y)*module
    //var aMod = module*(z.pinion+z.wheel)/(2+y)
    return {
        aWork: aWork,
        //aMod: aMod,
        addendum: 1*module,
        dedendum: 1.75*module,
        y: y,
        pinion: {
            base: z.pinion*module * Math.cos(angle.pressure.rad),
            pitch: z.pinion*module,
            tip: z.pinion*module + 2*module,
            root: z.pinion*module - 2.5*module,
        },
        wheel: {
            base: z.wheel*module * Math.cos(angle.pressure.rad),
            pitch: z.wheel*module,
            tip: z.wheel*module + 2*module,
            root: z.wheel*module - 2.5*module,
        },
    }
}

function YfFind() {}


function contactRatioFind(module, z, angle, gearGeom, a, b) {
    var yterm1 = Math.sqrt(((gearGeom.wheel.tip/2)**2)-((gearGeom.wheel.base/2)**2))
    var yterm2 = Math.sqrt(((gearGeom.pinion.tip/2)**2)-((gearGeom.pinion.base/2)**2))
    var yterm3 = a*Math.sin(angle.pressure.rad)
    var ydenominator = Math.PI * module * Math.cos(angle.pressure.rad)
    var epsil_y = (yterm1+yterm2-yterm3)/ydenominator

    var aw = Math.acos(Math.cos(angle.pressure.rad)/((2*gearGeom.y/(z.pinion+z.wheel))+1))

    var term1 = Math.sqrt(((gearGeom.wheel.tip/2)**2)-((gearGeom.wheel.base/2)**2))
    var term2 = Math.sqrt(((gearGeom.pinion.tip/2)**2)-((gearGeom.pinion.base/2)**2))
    var term3 = gearGeom.aWork*Math.sin(aw)
    var denominator = Math.PI * module * Math.cos(angle.pressure.rad)
    var epsil_a = (term1+term2-term3)/(denominator)

    var epsil_b = b * Math.sin(angle.helix.rad)/(Math.PI*module)

    return {
        y: epsil_y,
        a: epsil_a,
        b: epsil_b,
    }
}

function powerSpeedTorqueGet() {
    var power = parseFloat(document.getElementById('power').value) * 1000
    var speed = parseFloat(document.getElementById('speed').value) * 0.104719755
    var torque = parseFloat(document.getElementById('torque').value)
    return {
        power: power,
        speed: speed,
        torqe: torque
    }
}

function powerGet(power, speed, torque) {
    if (typeof power === 'undefined' || power === null) {
        var power = torque*speed
    } else { 
        var power = power
    }
    return power
}

function speedGet(power, speed, torque) {
    if (typeof speed === 'undefined' || speed === null) {
        var speed = power/torque
    } else {
        var speed = speed
    }
    return speed
}

function torqueGet(power, speed, torque) {
    if (typeof torque === 'undefined' || torque === null) {
        var torque = power/speed
    } else {
        var torque = torque
    }
    return torque
}

function torqueWheelf(torque, z) {
    return (torque*z.wheel/z.pinion)
}

// Option to have different pinion and wheel materials if time
function Kv1(ratio, material, z, angle, profileShift, ground, module, gearGeom, epsil, speed, torque, tanLoad, Ka, Ky, b) {
    var dMean={
        pinion: (gearGeom.pinion.root + gearGeom.pinion.tip)/2,
        wheel: (gearGeom.wheel.root + gearGeom.wheel.tip)/2
    }

    num1 = (Math.PI/8)*(dMean.pinion/gearGeom.pinion.base)**2
    num2 = dMean.pinion**2
    den1 = 1/(material.density)
    den2 = 1/(material.density*ratio**2)
    mRed = num1*(num2/(den1*den2))
    var zn1 = 4*z.pinion/(3*Math.cos(angle.helix.rad)+Math.cos(3*angle.helix.rad))
    var zn2 = 4*z.wheel/(3*Math.cos(angle.helix.rad)+Math.cos(3*angle.helix.rad))
    var q_dash = (0.04723)+(0.15551/zn1)+(0.25791/zn2)+(-0.00635*profileShift.pinion)+(-0.11654*profileShift.pinion/zn1)+(-0.00193*profileShift.wheel)+(-0.24188*profileShift.wheel/zn2)+(0.00529*(profileShift.pinion**2))+(0.00182*(profileShift.wheel**2))
    var c_dash_th = 1/((0.04723)+(0.15551/zn1)+(0.25791/zn2)+(-0.00635*profileShift.pinion)+(-0.11654*profileShift.pinion/zn1)+(-0.00193*profileShift.wheel)+(-0.24188*profileShift.wheel/zn2)+(0.00529*(profileShift.pinion**2))+(0.00182*(profileShift.wheel**2)))
    if (ground === 0) {
        h_fp = 1.25 
    } else {
        h_fp = 1.4
    }   
    var Cb = (1+0.5*(1.2-(h_fp/module)))*(1-0.02*(20-angle.helix.deg))
    var c_dash_st = c_dash_th * 1 * 0.8 * Cb * Math.cos(angle.helix.rad)
    // ISO 6336-1:2019 9.3.2.3   --   For not steel-steel c_dash = c_dash(st/st) * E/E(st)  where E = (2E1E2)/(E1+E2) [0.59 for cast iron]
    var E = (2*material.E*material.E)/(material.E+material.E)
    var c_dash = c_dash_st * (E/190e9)
    var cya = c_dash * ((0.75*epsil.a)+0.25)
    var cyb = cya*0.85

    var N = (speed*Math.PI*z.pinion/30000)*Math.sqrt(mRed/cya)
    return {
        N:N,
        c_dash:c_dash
    }
}

function Kv2 (ratio, material, z, angle, profileShift, ground, module, gearGeom, epsil, speed, torque, tanLoad, Ka, Ky, sigma_hlim, b, N, c_dash) {
    // Need facewidth calced
    if ((tanLoad*Ka*Ky)/b < 100) {
        Ns = 0.5+0.35*(Math.sqrt(tanLoad*Ka*Ky)/(100*b))
    } else {
        Ns = 0.85
    }

    if (epsil.a > 2) {
        var cv1 = 0.32
        var cv2 = 0.57/(epsil.y-0.3)
        var cv3 = 0.096/(epsil.y-1.56)
        var cv4 = (0.57-0.05*epsil.y)/(epsil.y-1.44)
        var cv5 = 0.47
        var cv6 = 0.12/(epsil.y-1.74)
        if (epsil.a > 2.5) {
            var cv7 = 1
        } else {
            var cv7 = 0.125*Math.sin(Math.PI*(epsil.y-2))+0.875
        }
    } else {
        var cv1 = 0.32
        var cv2 = 0.34
        var cv3 = 0.25
        var cv4 = 0.9
        var cv5 = 0.47
        var cv6 = 0.47
        if (epsil.y > 1.5) {
            var cv7 = 0.125*Math.sin(Math.PI*(epsil.y-2))+0.875
        } else {
            var cv7 = 0.75
        }
    }

    var sigma_hlim = permissibleContactStress(material)
    var {ffa_eff, fpb_eff} = tolerances(gearGeom, module, quality, sigma_hlim)
    var cay = (1/18)*((sigma_hlim/97)-18.45)**2 +1.5
        //no documentation on root relief
    var cf1 = 0
    var cf2 = 0

    var Bp = c_dash * fpb_eff /(Ka*Ky*nomTanLoad/b)
    var Bf = c_dash * ffa_eff /(Ka*Ky*nomTanLoad/b)
    var Bk = Math.abs(1-(c_dash*(Math.min(cay+cf2, cay+cf1)))/(Ka*Ky*nomTanLoad/b))

    if (N <= Ns) {
        var K = (cv1*Bp)+(cv2*Bf)+(cv3*Bk)
        var Kv = (N*K)+1
    } else if (Ns < N && N <= 1.15) {
        var Kv = (cv1*Bp)+(cv2+Bf)+(cv4*Bk)+1
    } else if (N >= 1.5) {
        var Kv = (cv5*Bp)+(cv6*Bf)+cv7
    } else if (N > 1.15 && N < 1.5) {
        var Kv = ((cv5*Bp)+(cv6*Bf)+cv7) + ((((cv1*Bp)+(cv2+Bf)+(cv4*Bk)+1)-((cv5*Bp)+(cv6*Bf)+cv7))/0.35) * (1.5-N)
    }

}
//-0.00635*profileShift.pinion+(-0.11654*profileShift.pinion/zn1)-0.00193*profileShift.wheel+(-0.24188*profileShift.wheel/zn2)+0.00529*profileShift.pinion**2+0.00182*profileShift.wheel**2

function nomTanLoad(torque, torqueWheel, gearGeom, module) {
    return {
            pinion: 2000*torque/(gearGeom.pinion.pitch*module/2),
            wheel: 2000*torqueWheel/(gearGeom.wheel.pitch*module/2)
    }
}

function permissibleContactStress(material) {
    sigma_hlim = material.hardness.A.contact*material.hardness.contact + material.hardness.B.contact
    console.log(sigma_hlim)
    return sigma_hlim
}
function permissibleBendingStress(material) {
    sigma_flim = material.hardness.A.bending*material.hardness.bending + material.hardness.B.bending
    console.log(sigma_flim)
    return sigma_flim
}

function rootBendingStress(Ka, Ky, Kv, Kfb, Kfa, b, module, tanLoad, epsil) {
    if (epsil.a < 2 && epsil.b == 0) {
        fepsil = 1
    } else if (epsil.a >= 2 && epsil.b == 0) {
        fepsil = 0.7
    } else if (epsil.a < 2 && epsil.b < 1 && epsil.b > 0) {
        fepsil = (1-epsil.b+(epsil.b/epsil.a))**0.5
    } else if (epsil.a >= 2 && epsil.b < 1 && epsil.b > 0) {
        fepsil = (((1-epsil.b)/2)+(epsil.b/epsil.a))**0.5
    } else if (epsil.b >= 1) {
        fepsil = epsil.a**(-0.5)
    }

    //var Yf = (()/())*fepsil
    var sigma_f0 = (tanLoad/(b*module)) * Yf * Ys * Ybeta * Yb * Ydt
    var sigma_f = sigma_f0 * Ka * Ky * Kv * Kfb * Kfa
    return sigma_f
}

function FyInterp(z, Fy) {
    for (i = 1; i<=Fy.length; i++) {
        if (z.pinion = Fy[i-1][0]){
            var Fy1 = Fy[i-1][1]
        } else if (z.pinion < Fy[i-1][0]) {
            i++
        } else {
            var Fy1 = ((z.pinion-Fy[i-1][0])/(Fy[i][0]-Fy[i-1][0]))*(Fy[i][1]-Fy[i-1][1])+Fy[i-1][1]
        }
    }
    return Fy1
}

// function contactStress() {
//     sigma_h0 = Zh*Ze*Zepsil*Zbeta*Math.sqrt((nomTanLoad/gearGeom.pinion.pitch)*((ratio+1)/ratio))
//     sigma_h1 = Zb*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha)
//     sigma_h2 = Zd*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha)
// }

// function toothRootStressCalc1() {
//     rootStress = nomRootStress * Ka * Ky * Kv * Kfb * Kfa
// }
function toothRootStressCalc2(epsil, angle, z, Fy, ftnom, b, module) {
    var Yb = 1
    var Ydt = 1
    if (epsil.b > 0 && epsil.b < 1) {
        epsil.b = epsil.b
    } else if (epsil.b > 1) {
        epsil.b = 1
    } else {
        epsil.b = 0
    }
    if (angle.helix.rad > 30) {
        angle.helix.rad = 30
    } else {
        angle.helix.rad = angle.helix.rad
    }

    // Stress correction factor is 1 if no undercut
    var Ys = 1
    var Yf = FyInterp(z, Fy)
    var Ybeta = (1-epsil.b*angle.helix.deg/120)/(0.25*(3*Math.cos(angle.helix.rad)+Math.cos(3*angle.helix.rad)))
    rootStressNom = ftnom.pinion/(b * module) * Yf * Ys * Ybeta * Yb * Ydt
}

