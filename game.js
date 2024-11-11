import chalk, { Chalk } from 'chalk';
import readlineSync from 'readline-sync';

// 오브젝트 키 밸류(배열), map
// map 자료구조의 map을 구현한것 

//아이템 오브젝트
const ITEM_TYPE = {
  HEALTH_POTION : 1,
  ATTACK_POTION : 2,
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class Player {
  //기본값 설정
  //크확, 크뎀, 크저
  constructor(lv, exp, hp, def, atk) {
    this._lv = lv;
    this._exp = exp;
    this._hp = hp;
    this._def = def;
    this._atk = atk;
    this.skillPoints = 0; // 스킬 포인트
    this.inventory = []; // 인벤토리 추가
  }

  get lv() {
    return this._lv;
  }

  get exp() {
    return this._exp;
  }

  get hp() {
    return this._hp;
  }

  get def() {
    return this._def;
  }

  get atk() {
    return this._atk;
  }

  set lv(value) {
    this._lv = value;
  }

  set exp(value) {
    this._exp = value;
  }

  set hp(value) {
    this._hp = value;
  }
  set def(value) {
    this._def = value;
  }
  set atk(value) {
    this._atk = value;
  }

  attack(target) {
    //크리 확률 attack함수내에서 실행
    const isCritical = Math.random() > 0.9;
    let dmg = this.atk - target.def;
    // 공격력 - 방어력으로 데미지 설정
    if (isCritical) {
      dmg *= 2;
    }
    //공격력 - 방어력이 -값이 나올 시 1로 고정
    if (dmg <= 0)
      dmg = 1;
    // 플레이어의 공격
    target.hp -= dmg;

    return isCritical;
  }

  // 아이템 사용 함수
  useItem(item) {
    // 레벨에 최대체력을 부여해서 최대체력까지 회복되게
    // 오브젝트 타입 
    //if (item === ITEM_TYPE.HEALTH_POTION) {
    if(item === "Health Potion"){
      this.hp += 20;
      console.log(chalk.green("플레이어가 체력 포션을 사용하여 HP가 20 회복되었습니다."));
    }
  }

  //스테이지 끝난 후 플레이어의 체력 회복
  stageHealingPlayer(){
    //만약 회복량이 최대 체력보다 높아지면 최대체력으로 세팅
    //스테이지 회복량 , 최대체력 
    if(this._hp + 20 > 100)
    {
      this._hp = 100;
    }
    else{
      this._hp += 20;
    }
  }

  levelUp() {
    const maxExp = 100 + (this.lv - 1) * 20;

    if (this.exp >= maxExp) {
      this.lv++;
      this.exp -= maxExp; // 초과한 경험치는 다음 레벨에 반영
      this.skillPoints += 1; // 레벨업 시 스킬 포인트 증가
      console.log(chalk.green(`축하합니다! 플레이어가 레벨 ${this.lv}로 올랐습니다!`));
    }
  }
}

class Monster {
  //기본 값 설정
  //크확, 크뎀, 크저, 상성 관련은 어떤식으로 할지
  constructor(hp, def, atk, exp) {
    this._hp = hp;
    this._def = def;
    this._atk = atk;
    this._exp = exp;
  }

  get hp() {
    return this._hp;
  }
  get def() {
    return this._def;
  }
  get atk() {
    return this._atk;
  }
  get exp() {
    return this._exp;
  }
  set hp(value) {
    this._hp = value;
  }
  set def(value) {
    this._def = value;
  }
  set atk(value) {
    this._atk = value;
  }
  set exp(value){
    this._exp = value;
  }

  GetState(stage) {
    if (stage !== 1) {
      //스테이지의 상승에 따라 적의 스테이터스 상승
      const hpIncrease = stage * 10;
      const defIncrease = Math.floor(stage * 1.5);
      const atkIncrease = Math.floor(stage * 2);
      const expIncrease = Math.floor(stage * 0.5);

      this._hp += hpIncrease;
      this._def += defIncrease;
      this._atk += atkIncrease;
      this._exp += expIncrease;
    }
  }

  attack(target) {
    // 공격력 - 방어력으로 데미지 설정
    let dmg = this.atk - target.def;
    // 몬스터의 공격
    //공격력 - 방어력이 -값이 나올 시 1로 고정
    if (dmg <= 0)
      dmg = 1;
    target.hp -= dmg;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |\n`) +
    chalk.blueBright(
      `| 플레이어 정보 |`,
    ) +
    chalk.redBright(
      ` 몬스터 정보 | \n`,
    ),
    chalk.blueBright(
      `Player LV : ${player.lv} | EXP : ${player.exp} \n`,
    ),
    chalk.blueBright(
      `Player : hp ${player.hp} | def ${player.def} | atk ${player.atk} \n`,
    ),
    chalk.redBright(
      `Monster : hp ${monster.hp} | def ${monster.def} | atk ${monster.atk}`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  monster.GetState(stage);

  let playerLogs = [];
  let enemyLogs = [];
  let turnlogs = [];
  let turn = 0;

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    // 플레이어 턴
    console.log(chalk.redBright(`현재 턴 : ${turn}\n`));
    console.log(chalk.green(`\n플레이어의 턴입니다.`));
    console.log(chalk.green(`\n1. 공격한다 2. 스킬 3. 아이템 4. 도망치기`));
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === "1" || choice === "2" || choice === "3") {
      playerLogs.push(chalk.green(`플레이어가 선택했습니다. ${choice}`));
      await battleCheck(player, monster, choice, turnlogs);
    } else if (choice === "4") {
      // 도망치기의 확률 추가 -> 도망치기를 성공하면 어떤식으로 다시 시작을 할지?
      const canEscape = Math.random() > 0.95;
      if (canEscape) {
        playerLogs.push(chalk.grey(`플레이어가 도망을 쳤습니다.`));
        break; // 도망에 성공했으면 전투 종료
      } else {
        playerLogs.push(chalk.grey(`플레이어가 도망에 실패했습니다.`));
      }
    } else {
      console.log(`잘못된 값이 입력되었습니다.`);
      readlineSync.question("\n다시 입력하려면 Enter 키를 누르세요...");
      continue; // 잘못된 값이 입력되면 현재 턴을 다시 시작
    }

    // 몬스터 턴
    if (monster.hp > 0) {
      console.log(chalk.redBright(`\n적의 턴입니다.`));
      console.log(chalk.redBright(`\n적이 선택중입니다...`));
      await delay(500); 
      const monsterChoice = Math.random() < 0.5 ? "1" : "2";
      await monsterBattleCheck(player, monster, monsterChoice, turnlogs);
    }
    if (player.hp <= 0) {
      turnlogs.push(chalk.redBright("플레이어가 패배했습니다."));
    } else if (monster.hp <= 0) {
      playerLogs.push(chalk.green("몬스터를 처치했습니다!"));
    }

    // 현재 턴 로그 출력 후 잠시 멈춤
    console.log(`\n--- ${turn}턴의 행동 로그 ---`);
    playerLogs.forEach((log) => console.log(log));
    turnlogs.forEach((log) => console.log(log));
    enemyLogs.forEach((log) => console.log(log));
    readlineSync.question("\n다음 턴으로 진행하려면 Enter 키를 누르세요...");

    playerLogs = [];
    turnlogs = [];
    enemyLogs = [];

    turn++;
  }
};

const battleCheck = async (player, monster, choice, logs) => {
  if (choice === "1") {
    const isCritical = player.attack(monster);
    if (isCritical) {
      logs.push(
        chalk.greenBright(`플레이어가 크리티컬 공격을 하였습니다.`),
        chalk.greenBright(`공격 후 몬스터의 남은 HP: ${monster.hp}`)
      );
    }
    else {
      logs.push(
        chalk.greenBright(`플레이어가 공격을 하였습니다.`),
        chalk.greenBright(`공격 후 몬스터의 남은 HP: ${monster.hp}`)
      );
    }

  } else if (choice === "2") {
    logs.push(chalk.green(`플레이어가 스킬 사용을 하였습니다.`));
    //스킬 사용 함수 추가
  } else if (choice === "3") {
    if (player.inventory.length === 0) {
      logs.push(chalk.red("인벤토리에 아이템이 없습니다."));
    } else {
      console.log("인벤토리에 있는 아이템:");
      player.inventory.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
      });

      const itemChoice = readlineSync.question("사용할 아이템을 선택하세요: ");
      const selectedItem = player.inventory[parseInt(itemChoice) - 1];

      if (selectedItem) {
        player.useItem(selectedItem);
        player.inventory.splice(parseInt(itemChoice) - 1, 1); // 아이템 사용 후 제거
        logs.push(chalk.green(`플레이어가 ${selectedItem}을(를) 사용했습니다.`));
      }
    }
  }
};

//몬스터의 선택 증가
const monsterBattleCheck = async (player, monster, choice, logs) => {
  if (choice === "1") {
    monster.attack(player);
    logs.push(
      chalk.redBright(`몬스터가 공격을 하였습니다.`),
      chalk.redBright(`공격 후 플레이어의 남은 HP: ${player.hp}`)
    );
  }
  else if (choice === "2") {
    logs.push(chalk.redBright(`몬스터는 아무 행동도 하지 않았습니다.`));
  }
}

const battleResultFuntion = async (stage, player, exp) => {
  console.clear();

  player.exp += exp;
  console.log(chalk.yellow(`플레이어가 ${exp} 경험치를 획득했습니다.`));

  // 레벨업 체크
  player.levelUp(); // 경험치가 증가한 후 레벨업 조건 확인

  if (player.skillPoints > 0) {
    await levelUpUI(player); // 레벨업 UI 호출
  }

  console.clear();
  console.log("아이템 선택 화면");
  console.log("다음 중 하나의 아이템을 선택하세요:");

  //체력 회복 아이템, 데미지 향상 아이템, 방어력 향상 아이템, 
  //깡 엔터 누르면 그냥 넘어감 버그 수정
  const items = ["Health Potion", "Attack Boost", "Defense Boost", "Speed Boost"];

  const randomItems = Array.from({ length: 4 }, () => items[Math.floor(Math.random() * items.length)]);

  randomItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });

  const choice = readlineSync.question("아이템을 선택하세요 (1-4): ");
  const selectedItem = randomItems[parseInt(choice) - 1];

  if (selectedItem) {
    player.inventory.push(selectedItem);
    console.log(chalk.yellow(`${selectedItem}이(가) 인벤토리에 추가되었습니다.`));
  }

  //턴이 끝나고 아이템을 선택한 후 휴식? / 강행하면 경험치 추가? 아이템 추가 증정
  player.stageHealingPlayer();

  stage++;
  return stage;
}

const levelUpUI = async (player) => {
  while (player.skillPoints > 0) {
    console.clear();
    console.log(chalk.yellow(`레벨업! 스킬 포인트가 ${player.skillPoints} 남았습니다.`));
    console.log("스탯을 선택하여 포인트를 배분하세요:");
    console.log("1. HP 증가\n2. 공격력 증가\n3. 방어력 증가");

    const choice = readlineSync.question("선택 (1-3): ");
    
    switch (choice) {
      case "1":
        player.hp += 10;
        console.log(chalk.green("HP가 10 증가했습니다."));
        break;
      case "2":
        player.atk += 2;
        console.log(chalk.green("공격력이 2 증가했습니다."));
        break;
      case "3":
        player.def += 2;
        console.log(chalk.green("방어력이 2 증가했습니다."));
        break;
      default:
        console.log(chalk.red("잘못된 선택입니다. 다시 입력해주세요."));
        continue;
    }

    player.skillPoints -= 1;
    readlineSync.question("\n포인트를 분배하려면 Enter 키를 누르세요...");
  }
}

//게임의 전체적인 방식
//크확, 크뎀, 상성, 크리티컬 저항?
//스킬관련 아이디어 추가
// 몬스터의 체력, 공격력, 방어력, 그런 류의 데이터를 엑셀 임폴트?


//게임 시작 로직 | import할 함수는 앞에 export붙이기 
export async function startGame() {
  console.clear();
  const player = new Player(1, 0, 100, 10, 50);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(100, 5, 15, 50);
    await battle(stage, player, monster);

    // 스테이지 끝나면 플레이어에게 체력 회복, exp 증가, 골드 획득
    // 스테이지 중간에 상점? 스테이지

    // 스테이지 클리어 및 게임 종료 조건
    stage = await battleResultFuntion(stage, player, monster.exp);
  }
}