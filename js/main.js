setTimeout(()=>{
    let skins=Object.keys(decadeUI.dynamicSkin),dp=dpbf.dynamicSkins
    for(let i of skins){
        console.warn(i);
        if(dp[i]){delete decadeUI.dynamicSkin[i];console.warn`删除`}
    }
},5000)