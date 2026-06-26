const followEveryone = (async () => {
  const FOLLOW_LIMIT = 1000;
  const BREAK_DURATION = 20 * 1000;
  const TOTAL_DURATION = 10 * 60 * 1000;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const seconds = (ms) => Math.round(ms / 1000);

  const findActiveDialog = () =>
    Array.from(document.querySelectorAll('[role="dialog"]'))
      .filter((dialog) => {
        const rect = dialog.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .at(-1);

  const findScrollableContainer = () => {
    const dialog = findActiveDialog();
    const root = dialog || document;
    const actionButton = Array.from(root.querySelectorAll("button")).find(
      (button) => ["Follow", "Following"].includes(button.innerText.trim())
    );

    let ancestor = actionButton?.parentElement;

    while (ancestor && ancestor !== root.parentElement) {
      if (ancestor.scrollHeight > ancestor.clientHeight + 2) {
        return ancestor;
      }

      ancestor = ancestor.parentElement;
    }

    const containers = Array.from(
      root.querySelectorAll("div")
    ).filter((el) => el.scrollHeight > el.clientHeight + 2);

    return containers.sort(
      (a, b) =>
        b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight)
    )[0];
  };

  const isButtonVisible = (button, dialog) => {
    const buttonRect = button.getBoundingClientRect();
    const boundaryRect = dialog?.getBoundingClientRect() || {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
    const style = window.getComputedStyle(button);
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    const elementAtCenter = document.elementFromPoint(centerX, centerY);

    return (
      buttonRect.width > 0 &&
      buttonRect.height > 0 &&
      buttonRect.bottom > boundaryRect.top &&
      buttonRect.top < boundaryRect.bottom &&
      buttonRect.right > boundaryRect.left &&
      buttonRect.left < boundaryRect.right &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      (elementAtCenter === button || button.contains(elementAtCenter))
    );
  };

  const findVisibleFollowButton = () => {
    const dialog = findActiveDialog();
    const root = dialog || document;

    return Array.from(root.querySelectorAll("button")).find(
      (button) =>
        button.innerText.trim() === "Follow" &&
        isButtonVisible(button, dialog)
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
            console.log("🔄 At the apparent bottom. Waiting briefly and checking again...");
            await delay(2000);
            followButton = findVisibleFollowButton();

            if (!followButton) {
              console.log("🏁 Reached the bottom. No more visible users to follow.");
              break;
            }
          } else {
            console.log("🧭 Scrolled, but no visible Follow button yet. Continuing...");
            continue;
          }
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

    console.log(`☕ Taking a ${seconds(BREAK_DURATION)}-second break. Tiny pause, big wisdom.`);
    await delay(BREAK_DURATION);

    startTime = new Date().getTime();
  }

  console.log(`✨ Follow script complete. Total followed in this run: ${followCount}.`);
  console.log("🌙 Done for now. Be kind to your account.");
})();
