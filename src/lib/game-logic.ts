import gameConfig from './game-config.json';
import { UserProgress } from './user-progress'; // Supondo que você tenha um tipo para o progresso do usuário

/**
 * Calcula o próximo estado do progresso do usuário após completar uma lição.
 * Esta função é pura e não tem efeitos colaterais.
 *
 * @param lessonId O ID da lição que o usuário completou.
 * @param currentProgress O estado atual do progresso do usuário.
 * @returns O novo estado do progresso do usuário.
 */
export function calculateNextProgress(
  lessonId: string,
  currentProgress: UserProgress
): UserProgress {
  const { progression, economy } = gameConfig;
  const newProgress: UserProgress = JSON.parse(JSON.stringify(currentProgress)); // Deep copy

  let lessonData = null;
  let levelData = null;
  let lessonIndex = -1;

  // Encontra a lição e o nível correspondente
  for (const level of progression.levels) {
    const foundIndex = level.lessons.findIndex(l => l.id === lessonId);
    if (foundIndex !== -1) {
      lessonData = level.lessons[foundIndex];
      levelData = level;
      lessonIndex = foundIndex;
      break;
    }
  }

  if (!lessonData || !levelData) {
    console.error(`Lição com ID ${lessonId} não encontrada no game_config.`);
    return currentProgress; // Retorna o progresso inalterado se a lição não for encontrada
  }

  // 1. Atualizar XP e Moedas
  if (!newProgress.completedLessons.includes(lessonId)) {
    newProgress.xp += lessonData.xpReward ?? economy.xpPerLessonDefault;
    newProgress.coins += lessonData.coinReward ?? economy.coinPerLessonDefault;
    newProgress.completedLessons.push(lessonId);
  }

  // 2. Atualizar Streak Diária
  const today = new Date();
  const lastStudy = newProgress.lastStudyDate ? new Date(newProgress.lastStudyDate) : null;
  today.setHours(0, 0, 0, 0);

  if (lastStudy) {
    lastStudy.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastStudy.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newProgress.streakDays += 1; // Estudou ontem, incrementa
    } else if (diffDays > 1) {
      newProgress.streakDays = 1; // Quebrou a sequência
    }
    // Se diffDays === 0, não faz nada (já estudou hoje)
  } else {
    newProgress.streakDays = 1; // Primeira vez estudando
  }
  newProgress.lastStudyDate = today.toISOString();


  // 3. Determinar a próxima lição e nível
  const isLastLessonInLevel = lessonIndex === levelData.lessons.length - 1;

  if (isLastLessonInLevel) {
    // Tenta encontrar o próximo nível
    const currentLevelIndex = progression.levels.findIndex(l => l.id === levelData!.id);
    const nextLevel = progression.levels[currentLevelIndex + 1];

    if (nextLevel && newProgress.xp >= nextLevel.minXpToUnlock) {
      // Avança para a primeira lição do próximo nível
      newProgress.currentLevelId = nextLevel.id;
      newProgress.currentLessonId = nextLevel.lessons[0].id;
    } else {
      // Completou o nível, mas não desbloqueou o próximo, ou é o último nível
      // A lição atual pode ser definida como a primeira do próximo nível bloqueado para referência
       if (nextLevel) {
         newProgress.currentLessonId = nextLevel.lessons[0].id;
       } else {
         // Última lição do último nível
         newProgress.currentLessonId = lessonId; 
       }
    }
  } else {
    // Avança para a próxima lição no mesmo nível
    newProgress.currentLessonId = levelData.lessons[lessonIndex + 1].id;
  }
  
  return newProgress;
}
