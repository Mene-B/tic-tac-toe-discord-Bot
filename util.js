module.exports = {
    verify : (array)=>{
        const wins = [[],[],[],[],[],[],["1;1","2;2","3;3"],["3;1","2;2","1;3"]];
        for(let i=1;i<=3;i++){
            for(let j=1;j<=3;j++){
                wins[i-1].push(j.toString()+";"+i.toString());
                wins[i+2].push(i.toString()+";"+j.toString())
            }
        }
        const verif = wins.map(element => {
            if(array.includes(element[0]) && array.includes(element[1]) && array.includes(element[2])){
                return true
            }else{
                return false
            }
        })
        if(verif.includes(true)){
            return true;
        }else{
            return false;
        }
    }
}