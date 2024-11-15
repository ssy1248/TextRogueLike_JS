import chalk, { Chalk } from 'chalk';
import readlineSync from 'readline-sync';

class Achive{
    constructor(){
        this.clear = 0; //클리어 횟수
        this.lose = 0;
        this.useItem = 0;
        this.getItem = 0;
        this.useSkill = 0;
        this.monsterKill = 0;
    }
}

export const playerAchivement = new Achive();

export async function startAchivement(){
    console.clear();

    console.log(chalk.greenBright("============================"));
    console.log(chalk.greenBright("============업적============"));
    console.log(chalk.greenBright("============================"));

    if(playerAchivement.clear === 1){
        console.log(chalk.whiteBright("게임을 최초로 클리어했습니다."));
    }
    if(playerAchivement.getItem >= 5){
        console.log(chalk.whiteBright("아이템을 5번 이상 획득하였습니다"));
    }
    if(playerAchivement.useItem >= 3){
        console.log(chalk.whiteBright("아이템을 3번 이상 사용하였습니다."));
    }
    if(playerAchivement.useSkill >= 5){
        console.log(chalk.whiteBright("스킬을 5번 이상 사용하였습니다."));
    }
    if(playerAchivement.monsterKill >= 5){
        console.log(chalk.whiteBright("몬스터 5번 이상 처치하셨습니다"));
    }

    console.log("0. 로비로 돌아가기");
    let choice = parseInt(readlineSync.question("선택 : "));

    if (choice === 0) {
        resolve(); // 0을 선택하면 서버로 돌아감
    } else {
        console.log(chalk.red('올바른 선택을 하세요.'));
        startOption(); 
    }
}