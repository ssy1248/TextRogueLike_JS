import chalk, { Chalk } from 'chalk';
import readlineSync from 'readline-sync';

export async function startOption() {
    console.clear();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.green(`-----------옵션-----------`));
    console.log(chalk.blueBright(`==================================`));

    //옵션은 아이디어가 떠오르지 않아서 틀만 만들어놨습니다.

    console.log("0. 로비로 돌아가기");
    const choice = parseInt(readlineSync.question("선택 : "));

    if (choice === 0) {
        resolve(); // 0을 선택하면 서버로 돌아감
    } else {
        console.log(chalk.red('올바른 선택을 하세요.'));
        startOption(); 
    }
}