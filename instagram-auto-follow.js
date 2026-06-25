const followEveryone = (async () => {
  const FOLLOW_LIMIT = 1000;
  const BREAK_DURATION = 5 * 60 * 1000;
  const TOTAL_DURATION = 10 * 60 * 1000;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const seconds = (ms) => Math.round(ms / 1000);

  const findScrollableContainer = () => {
    const dialog = document.querySelector('[role="dialog"]');

    const containers = Array.from(
      (dialog || document).querySelectorAll("div")
    ).filter((el) => el.scrollHeight > el.clientHeight + 100);

    return containers.sort((a, b) => b.clientHeight - a.clientHeight)[0];
  };

  const isButtonVisibleInContainer = (button, container) => {
    const buttonRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
      buttonRect.top >= containerRect.top &&
      buttonRect.bottom <= containerRect.bottom &&
      buttonRect.width > 0 &&
      buttonRect.height > 0
    );
  };

  const findVisibleFollowButton = () => {
    const container = findScrollableContainer();
    if (!container) return null;

    return Array.from(document.querySelectorAll("button")).find(
      (button) =>
        button.innerText.trim() === "Follow" &&
        isButtonVisibleInContainer(button, container)
    );
  };

  const scrollOneBatch = async () => {
    const container = findScrollableContainer();

    if (!container) {
      window.scrollBy({
        top: window.innerHeight * 0.85,
        behavior: "smooth",
      });

      await delay(1500);
      return true;
    }

    const before = container.scrollTop;
    const scrollAmount = container.clientHeight * 0.85;

    container.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });

    await delay(1800);

    const after = container.scrollTop;
    const isAtBottom =
      Math.ceil(container.scrollTop + container.clientHeight) >=
      container.scrollHeight;

    return after !== before && !isAtBottom;
  };

  console.log("🌱 Instagram Auto Follow started.");
  console.log("👀 Looking for visible Follow buttons in the current list...");
  console.log("⚠️ Use gently. Random waits help avoid repetitive timing, but they do not guarantee safety from rate limits or restrictions.");

  let startTime = new Date().getTime();
  let followCount = 0;

  while (new Date().getTime() - startTime < TOTAL_DURATION) {
    for (let i = 0; i < FOLLOW_LIMIT; i++) {
      const FOLLOW_INTERVAL = Math.floor(Math.random() * 10 + 1) * 5000;

      let followButton = findVisibleFollowButton();

      if (!followButton) {
        console.log("🔎 No visible Follow button right now. Scrolling a little...");
        const canScrollMore = await scrollOneBatch();

        await delay(1000);

        followButton = findVisibleFollowButton();

        if (!followButton) {
          if (!canScrollMore) {
            console.log("🏁 Reached the bottom. No more visible users to follow.");
            break;
          }

          console.log("🧭 Scrolled, but no visible Follow button yet. Continuing...");
          continue;
        }
      }

      followButton.scrollIntoViewIfNeeded?.();
      followButton.click();

      await delay(100);

      followCount++;
      console.log(`✅ Followed #${followCount}`);

      console.log(`⏳ Waiting ${seconds(FOLLOW_INTERVAL)} seconds before the next one...`);
      await delay(FOLLOW_INTERVAL);
    }

    console.log(`☕ Taking a ${BREAK_DURATION / 1000 / 60}-minute break. Tiny pause, big wisdom.`);
    await delay(BREAK_DURATION);

    startTime = new Date().getTime();
  }

  console.log(`✨ Follow script complete. Total followed in this run: ${followCount}.`);
  console.log("🌙 Done for now. Be kind to your account.");
})();
