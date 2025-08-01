let currentDuel = null;
let duelTimeout = null;

export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) return res.status(400).send("Usuário inválido.");

  if (!currentDuel) {
    currentDuel = { user1: user, startedAt: Date.now() };

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

  const victoryMessages = [
    "💥 {{winner}} derrotou {{loser}} com um golpe crítico!",
    "⚔️ {{winner}} esquivou e contra-atacou! {{loser}} caiu!",
    "☠️ {{loser}} subestimou {{winner}}... e pagou o preço.",
    "🔪 {{winner}} venceu {{loser}} com estilo!",
    "🔥 {{loser}} foi consumido pelas chamas da derrota de {{winner}}!",
    "😺 {{loser}} tomou gap da yuumizinha de {{winner}} kkkkk!",
  ];

  const drawMessages = [
    "🤝 {{user1}} e {{user2}} travaram um duelo épico... mas terminou em empate!",
    "⚔️ {{user1}} e {{user2}} se enfrentaram com honra. Nenhum saiu vencedor.",
    "🌀 O duelo entre {{user1}} e {{user2}} foi tão intenso que terminou em empate!",
    "🎭 Ambos {{user1}} e {{user2}} recuaram ao mesmo tempo. Empate técnico!",
  ];

  const rand = Math.random();
  let message = "";

  if (rand < 0.33) {
    const msg = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    message = `/timeout ${user1} 60 ` + msg.replace("{{winner}}", user2).replace("{{loser}}", user1);
  } else if (rand < 0.66) {
    const msg = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    message = `/timeout ${user2} 60 ` + msg.replace("{{winner}}", user1).replace("{{loser}}", user2);
  } else {
    const msg = drawMessages[Math.floor(Math.random() * drawMessages.length)];
    message = msg.replace("{{user1}}", user1).replace("{{user2}}", user2);
  }

  return res.send(message);
}
