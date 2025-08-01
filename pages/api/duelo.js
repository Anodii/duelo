let currentDuel = null;
let duelTimeout = null;

export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) return res.status(400).send("Usuário inválido.");

  if (!currentDuel) {
    // Inicia duelo
    currentDuel = { user1: user, startedAt: Date.now() };

    // Reseta após 30 segundos se ninguém aceitar
    duelTimeout = setTimeout(() => {
      currentDuel = null;
    }, 30000);

    return res.send(`🗡️ ${user} iniciou um duelo! Digite !duelo para aceitar nos próximos 30s.`);
  }

  if (currentDuel.user1 === user) {
    return res.send(`⚠️ ${user}, você já está no duelo!`);
  }

  const user1 = currentDuel.user1;
  const user2 = user;

  clearTimeout(duelTimeout);
  currentDuel = null;

  const rand = Math.random();
  if (rand < 0.33) {
    return res.send(`/timeout ${user1} 60 ☠️ ${user2} venceu o duelo contra ${user1}!`);
  } else if (rand < 0.66) {
    return res.send(`/timeout ${user2} 60 ☠️ ${user1} venceu o duelo contra ${user2}!`);
  } else {
    return res.send(`⚔️ ${user1} e ${user2} empataram! Ambos sobreviveram... por enquanto. Ta`);
  }
}
