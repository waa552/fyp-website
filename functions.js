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

function KaGet() {
    var a = parseFloat(document.getElementById('Ka_in').value) || 1.5
    if (a<1) {
        alert("Please check the Application factor table for appropriate values")
    } else {
        var Ka = a
    }
    return Ka
}

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
    var e = document.getElementById("FinishSelection").value
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
   var ratioTolLow = parseFloat(document.getElementById('ratioTolLow').value) || 0.05
   var ratioTolUp = parseFloat(document.getElementById('ratioTolUp').value) || 0.05
   
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

function contactRatioTeeth(angle, a0, z) {
    var {ratio, z} = ratioCheck(z)
    var module = Math.floor(2*a0.ideal/(z.pinion+z.wheel))
    var b = 2*module*Math.PI
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
        //var {ratio, z} = ratioCheck(z)
        var epsil = contactRatioFind(module, z, angle, gearGeom, a, b)
    }

    return {
        a: a,
        z: z,
        module: module,
        epsil: epsil,
        ratio: ratio,
        b: b,
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
    var ratioTolLow = parseFloat(document.getElementById('ratioTolLow').value) || 0.05
    var ratioTolUp = parseFloat(document.getElementById('ratioTolUp').value) || 0.05
    var ratioMin = ratioIdeal - ratioTolLow
    var ratioMax = ratioIdeal + ratioTolUp
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

    document.getElementById('a0Num').innerHTML = Math.floor(centreDist*1000)/1000
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

function contactRatioFind(module, z, angle, gearGeom, a, b) {
    var aw = Math.acos(Math.cos(angle.pressure.rad)/((2*gearGeom.y/(z.pinion+z.wheel))+1))

    var term1 = Math.sqrt(((gearGeom.wheel.tip/2)**2)-((gearGeom.wheel.base/2)**2))
    var term2 = Math.sqrt(((gearGeom.pinion.tip/2)**2)-((gearGeom.pinion.base/2)**2))
    var term3 = gearGeom.aWork*Math.sin(aw)
    var denominator = Math.PI * module * Math.cos(angle.pressure.rad)
    var epsil_a = (term1+term2-term3)/(denominator)

    var epsil_b = b * Math.sin(angle.helix.rad)/(Math.PI*module)

    var epsil_y = epsil_a + epsil_b

    return {
        y: epsil_y,
        a: epsil_a,
        b: epsil_b,
    }
}

function powerSpeedTorqueGet() {
    var power = parseFloat(document.getElementById('power').value)
    var speed = parseFloat(document.getElementById('speed').value)
    var torque = parseFloat(document.getElementById('torque').value)
    return {
        power: power,
        speed: speed,
        torqe: torque,
    }
}

function powerGet(power, speed, torque) {
    if (typeof power === 'undefined' || power === null) {
        var power = torque*speed/9549
    } else { 
        var power = power
    }
    return power
}

function speedGet(power, speed, torque) {
    if (typeof speed === 'undefined' || speed === null) {
        var speed = 9549*power/torque
    } else {
        var speed = speed
    }
    return speed
}

function torqueGet(power, speed, torque) {
    if (typeof torque === 'undefined' || torque === null) {
        var torque = 9549*power/speed
    } else {
        var torque = torque
    }
    return torque
}
function torqueWheelf(torque, z) {
    return (torque*z.wheel/z.pinion)
}

// Option to have different pinion and wheel materials if time
function Kv1(ratio, material, z, angle, profileShift, ground, module, gearGeom, epsil, speed) {
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

function Kv2 (material, module, gearGeom, epsil, tanLoad, Ka, Ky, sigma_hlim, b, N, c_dash, ffa_eff, fpb_eff) {
    // Need facewidth calced
    if ((tanLoad.pinion*Ka*Ky)/b < 100) {
        Ns = 0.5+0.35*(Math.sqrt(tanLoad.pinion*Ka*Ky)/(100*b))
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

    var {ffa_eff, fpb_eff} = tolerances(gearGeom, module, quality, sigma_hlim)
    var cay = (1/18)*((sigma_hlim/97)-18.45)**2 +1.5
        //no documentation on root relief
    var cf1 = 0
    var cf2 = 0

    var Bp = c_dash * fpb_eff /(Ka*Ky*tanLoad.pinion/b)
    var Bf = c_dash * ffa_eff /(Ka*Ky*tanLoad.pinion/b)
    var Bk = Math.abs(1-(c_dash*(Math.min(cay+cf2, cay+cf1)))/(Ka*Ky*tanLoad.pinion/b))

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
return Kv
}
//-0.00635*profileShift.pinion+(-0.11654*profileShift.pinion/zn1)-0.00193*profileShift.wheel+(-0.24188*profileShift.wheel/zn2)+0.00529*profileShift.pinion**2+0.00182*profileShift.wheel**2

function nomTanLoad(torque, torqueWheel, gearGeom, module) {
    return {
            pinion: (2000*torque)/gearGeom.pinion.pitch,
            wheel: (2000*torqueWheel)/gearGeom.wheel.pitch,
    }
}

function limitContactStress(material) {
    console.log(material)
    sigma_hlim = material.hardness.A.contact*material.hardness.contact + material.hardness.B.contact
    return sigma_hlim
}
function limitBendingStress(material) {
    sigma_flim = material.hardness.A.bending*material.hardness.bending + material.hardness.B.bending
    return sigma_flim
}

function funcKfa(epsil, c_dash, fpb_eff, tanLoad, Ka, Ky, Kv, b) {
    if (epsil.y <= 2) {
        var Kfa1 = (epsil.y/2)*(0.9+0.4*(c_dash *((0.75*epsil.a)+0.25)*fpb_eff)/(tanLoad.pinion*Ka*Ky*Kv/b))
    } else {
        var Kfa1 = 0.9+0.4*(Math.sqrt((2*(epsil.y-1)/epsil.y))*((c_dash * ((0.75*epsil.a)+0.25)*fpb_eff)/(tanLoad.pinion*Ka*Ky*Kv/b)))
    }
    if (epsil.y <= 2) {
        var Kfa2 = (epsil.y/2)*(0.9+0.4*(c_dash *((0.75*epsil.a)+0.25)*fpb_eff)/(tanLoad.wheel*Ka*Ky*Kv/b))
    } else {
        var Kfa2 = 0.9+0.4*(Math.sqrt((2*(epsil.y-1)/epsil.y))*((c_dash * ((0.75*epsil.a)+0.25)*fpb_eff)/(tanLoad.wheel*Ka*Ky*Kv/b)))
    }
    return {
        Kfa1: Kfa1,
        Kfa2: Kfa2,
    }
}

function rootBendingStress(Ka, Ky, Kv, Kfb, epsil, sigma_f0, c_dash, fpb_eff, tanLoad, b, Kfa) {
    var sigma_f1 = sigma_f0.pinion * Ka * Ky * Kv * Kfb * Kfa.Kfa1
    var sigma_f2 = sigma_f0.wheel * Ka * Ky * Kv * Kfb * Kfa.Kfa2
    return {
        pinion: sigma_f1,
        wheel: sigma_f2,
    }
}

function FyInterp(z, Fy) {
    for (i = 1; i<=Fy.length; i++) {
        if (z.pinion > Fy[i-1][0] && z.pinion > Fy[i][0]) {
            continue
        } else if (z.pinion == Fy[i-1][0]) {
            var Fy1 = Fy[i-1][1]
            break
        } else if (z.pinion > Fy[i-1][0] && z.pinion < Fy[i][0]){
            var Fy1 = ((z.pinion-Fy[i-1][0])/(Fy[i][0]-Fy[i-1][0]))*(Fy[i][1]-Fy[i-1][1])+Fy[i-1][1]
            break
        }
    }
    for (i = 1; i<=Fy.length; i++) {
        if (z.wheel > Fy[i-1][0] && z.wheel > Fy[i][0]) {
            continue
        } else if (z.wheel == Fy[i-1][0]) {
            var Fy2 = Fy[i-1][1]
            break
        } else if (z.wheel > Fy[i-1][0] && z.wheel < Fy[i][0]){
            var Fy2 = ((z.wheel-Fy[i-1][0])/(Fy[i][0]-Fy[i-1][0]))*(Fy[i][1]-Fy[i-1][1])+Fy[i-1][1]
            break
        }
    }
    return {
        Fy1: Fy1,
        Fy2: Fy2,
    }
}

// function contactStress() {
//     sigma_h0 = Zh*Ze*Zepsil*Zbeta*Math.sqrt((nomTanLoad/gearGeom.pinion.pitch)*((ratio+1)/ratio))
//     sigma_h1 = Zb*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha)
//     sigma_h2 = Zd*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha)
// }

// function toothRootStressCalc1() {
//     rootStress = nomRootStress * Ka * Ky * Kv * Kfb * Kfa
// }

function toothRootStressCalc2(epsil, angle, z, Fy, tanload, b, module) {
    var Yb = 1
    if (epsil.a < 2.05) {
        var Ydt = 1
    } else if (epsil.a > 2.05 && epsil.a < 2.5) {
        var Ydt = -0.666*epsil.a + 2.366
    } else {
        var Ydt = 0.7
    }
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

    rootStressNom1 = (tanload.pinion/(b * module * Yf.Fy1)) * Ys * Ybeta * Yb * Ydt
    rootStressNom2 = (tanload.wheel/(b * module * Yf.Fy2)) * Yf.Fy2 * Ys * Ybeta * Yb * Ydt
    return {
        pinion: rootStressNom1,
        wheel: rootStressNom2,
    }
}

function lifeCycles(speed) {
    var a = parseFloat(document.getElementById('lifespan').value) || 10000
    var b = speed
    return (a*b)
}

function permissibleBendingStress(sigma_flim, module, speed) {
    if (module <= 5) {
        var Yx = 1
    } else if (module > 5 && module <= 30) {
        var Yx = 1.06-0.006*module
    } else {
        var Yx = 0.85
    }
    var cycles = lifeCycles(speed)
    if (cycles <= 10000) {
        var YNt = 2.5
    } else if (cycles <= 3e6) {
        var YNt = 1
    } else {
        var YNt = 0.85
    }
    
    if (document.getElementById('critCheck').checked == 'true') {
        var sF = sFMin.crit
    } else {
        var sF = sFMin.ind
    }
    var sigma_fp = sigma_flim * 2 * YNt * 1 * 1 * Yx / sF
    return sigma_fp
}

function permissibleContactStress(sigma_hlim, speed, gearGeom) {
    var cycles = lifeCycles(speed)
    if (cycles <= 10000) {
        var ZNt = 1.6
    } else if (cycles <= 5e7) {
        var ZNt = 1
    } else {
        var ZNt = 0.85
    }
    var vw = speed*Math.PI*gearGeom.pinion.pitch
    var Czl = 0.87
    var Czv = Czl + 0.02
    var Zl = Czl + 4*(1-Czl)*1.25
    var Zv = Czv + (2*(1-Czv))/Math.sqrt(0.8+32/vw)
    var Zr = 0.88
    var Zw = 1
    var Zx = 1

    if (document.getElementById('critCheck').checked == 'true') {
        var sF = sFMin.crit
    } else {
        var sF = sFMin.ind
    }

    var sigma_hp = sigma_hlim * ZNt * Zl * Zv * Zr * Zw * Zx / sF
    return sigma_hp
}

function bStress(Kfa, angle, a0, z, b, ratio, material, profileShift, quality, module, gearGeom, epsil, speed, tanLoad, Ka, Ky, sigma_hlim, N, c_dash, ffa_eff, fpb_eff, Fy, Kv, sigma_f0) {
    var {a, z, module, epsil, ratio} = contactRatioTeeth(angle, a0, z, b)
    var {N, c_dash} = Kv1(ratio, material, z, angle, profileShift, quality, module, gearGeom, epsil, speed)
    var Kv = Kv2(material, module, gearGeom, epsil, tanLoad, Ka, Ky, sigma_hlim, b, N, c_dash, ffa_eff, fpb_eff)

    var sigma_f0 = toothRootStressCalc2(epsil, angle, z, Fy, tanLoad, b, module)
    var sigma_f = rootBendingStress(Ka, Ky, Kv, 1, epsil, sigma_f0, c_dash, fpb_eff, tanLoad, b, Kfa)
    return sigma_f
}

function cStress(tanLoad, ratio, gearGeom, b, Ka, Ky, Kv, Kha, angle, z, material, epsil, a0, profileShift, quality, module, speed, sigma_hlim, N, c_dash, ffa_eff, fpb_eff) {
    var {a, z, module, epsil, ratio} = contactRatioTeeth(angle, a0, z, b)
    var {N, c_dash} = Kv1(ratio, material, z, angle, profileShift, quality, module, gearGeom, epsil, speed)
    var Kv = Kv2(material, module, gearGeom, epsil, tanLoad, Ka, Ky, sigma_hlim, b, N, c_dash, ffa_eff, fpb_eff)
    
    var sigma_h = contactStress(tanLoad, ratio, gearGeom, b, Ka, Ky, Kv, 1, Kha, angle, z, material, epsil)
    return sigma_h
}

function stressLewisEquation(b, tanLoad, Yf, module, Kv) {
    var pinionStress = Kv*tanLoad.pinion/(b*Yf.Fy1*module)
    var wheelStress = Kv*tanLoad.wheel/(b*Yf.Fy2*module)
    return {
        pinion: pinionStress,
        wheel: wheelStress,
    }
}

function contactStress(tanLoad, ratio, gearGeom, b, Ka, Ky, Kv, Khb, Kha, angle, z, material, epsil) {
    var aw = Math.acos(Math.cos(angle.pressure.rad)/((2*gearGeom.y/(z.pinion+z.wheel))+1))
    var Zh = Math.sqrt((2*Math.cos(angle.helix.rad)*Math.cos(aw))/(((1+Math.cos(angle.pressure.rad))/2)*Math.sin(aw)))
    var M1 = Math.tan(aw)/Math.sqrt((Math.sqrt(((gearGeom.pinion.tip**2)/(gearGeom.pinion.base**2)-1))-(2*Math.PI/z.pinion))*((Math.sqrt(((gearGeom.wheel.tip**2)/(gearGeom.wheel.base**2)-1))-(epsil.a-1)*(2*Math.PI/z.wheel))))
    var M2 = Math.tan(aw)/Math.sqrt((Math.sqrt(((gearGeom.wheel.tip**2)/(gearGeom.wheel.base**2)-1))-(2*Math.PI/z.wheel))*((Math.sqrt(((gearGeom.pinion.tip**2)/(gearGeom.pinion.base**2)-1))-(epsil.a-1)*(2*Math.PI/z.pinion))))
    if (epsil.a > 1 && epsil.b >= 1) {
        var Zb = Math.sqrt(1.2)
        var Zd = Math.sqrt(1.2)
    } else if (epsil.a > 1) {
        if (M1 <= 1) {
            Zb = 1
        } else {
            Zb = M1
        }
        if (M2 <= 1) {
            Zd = 1
        } else {
            Zd = M2
        }
    } else if (epsil.a > 1 && epsil.b < 1) {
        if (M1 <= 1) {
            Zb = 1 + epsil.b*(Math.sqrt(1.2)-1)
        } else {
            Zb = M1 + epsil.b*(Math.sqrt(1.2)-M1)
        }
        if (M2 <= 1) {
            Zd = 1 + epsil.b*(Math.sqrt(1.2)-1)
        } else {
            Zd = M2 + epsil.b*(Math.sqrt(1.2)-M2)
        }
    }
    var v = 0.3
    var Ze = Math.sqrt(material.E/(2*Math.PI*(1-v**2)))

    if (angle.helix.deg == 0) {
        var Zepsil = Math.sqrt(4-epsil.a/3)
    } else {
        if (epsil.b >= 1) {
            var Zepsil = Math.sqrt(1/epsil.a)
        } else {
            Zepsil = Math.sqrt(((4-epsil.a)/3)*(1-epsil.b)+(epsil.b/epsil.a))
        }
    }
    var Zbeta = Math.sqrt(1/Math.cos(epsil.b))

    var sigma_h0 = Zh*Ze*Zepsil*Zbeta*Math.sqrt((tanLoad.pinion*ratio+tanLoad.pinion)/(gearGeom.pinion.pitch*b*ratio))
    var sigma_h1 = Zb*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha.Kfa1)
    var sigma_h2 = Zd*sigma_h0*Math.sqrt(Ka*Ky*Kv*Khb*Kha.Kfa2)
    return {
        pinion: sigma_h1,
        wheel: sigma_h2,
    }
}
