const followEveryone = (async () => {
  const SCRIPT_VERSION = "2026-06-29.3";
  const FOLLOW_LIMIT = 1000;
  const BREAK_DURATION = 20 * 1000;
  const TOTAL_DURATION = 10 * 60 * 1000;
  const BOTTOM_CONFIRMATIONS = 3;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const seconds = (ms) => Math.round(ms / 1000);

  const findActiveDialog = () =>
    Array.from(document.querySelectorAll('[role="dialog"]'))
      .filter((dialog) => {
        const rect = dialog.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .at(-1);

  const isScrollableElement = (element) => {
    const overflowY = window.getComputedStyle(element).overflowY;

    return (
      ["auto", "scroll"].includes(overflowY) &&
      element.scrollHeight > element.clientHeight + 2
    );
  };

  const findScrollableContainer = () => {
    const dialog = findActiveDialog();
    const root = dialog || document;
    const containers = Array.from(root.querySelectorAll("div")).filter(
      isScrollableElement
    );

    return (
      containers.find((container) =>
        Array.from(container.querySelectorAll("button")).some((button) =>
          ["Follow", "Following", "Requested"].includes(
            button.innerText.trim()
          )
        )
      ) || containers[0]
    );
  };

  const isButtonVisible = (button, dialog) => {
    const buttonRect = button.getBoundingClientRect();
    let scrollableAncestor = button.parentElement;

    while (
      scrollableAncestor &&
      scrollableAncestor !== dialog &&
      !isScrollableElement(scrollableAncestor)
    ) {
      scrollableAncestor = scrollableAncestor.parentElement;
    }

    const boundaryRect =
      (scrollableAncestor && scrollableAncestor !== dialog
        ? scrollableAncestor.getBoundingClientRect()
        : dialog?.getBoundingClientRect()) || {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
    const style = window.getComputedStyle(button);
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    return (
      buttonRect.width > 0 &&
      buttonRect.height > 0 &&
      centerY >= boundaryRect.top &&
      centerY <= boundaryRect.bottom &&
      centerX >= boundaryRect.left &&
      centerX <= boundaryRect.right &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      style.pointerEvents !== "none"
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
      const page = document.scrollingElement || document.documentElement;
      const beforeTop = page.scrollTop;

      page.scrollTop = beforeTop + window.innerHeight * 0.85;

      await delay(1500);
      return page.scrollTop > beforeTop || document.hidden;
    }

    const beforeTop = container.scrollTop;
    const beforeHeight = container.scrollHeight;
    const scrollAmount = container.clientHeight * 0.85;

    container.scrollTop = Math.min(
      beforeTop + scrollAmount,
      container.scrollHeight - container.clientHeight
    );
    container.dispatchEvent(new Event("scroll", { bubbles: true }));

    await delay(2000);

    if (container.scrollTop > beforeTop) {
      return true;
    }

    let currentContainer = findScrollableContainer();

    if (currentContainer?.scrollHeight > beforeHeight) {
      return true;
    }

    if (document.hidden) {
      console.log(
        "🌙 Instagram is a background tab. Retrying instead of assuming the list ended..."
      );
      return true;
    }

    await delay(2000);

    currentContainer = findScrollableContainer();
    return currentContainer?.scrollHeight > beforeHeight;
  };

  console.log(`🌱 Instagram Auto Follow ${SCRIPT_VERSION} started.`);
  console.log("👀 Looking for visible Follow buttons in the current list...");
  console.log("⚠️ Use gently. Random waits help avoid repetitive timing, but they do not guarantee safety from rate limits or restrictions.");

  let startTime = new Date().getTime();
  let followCount = 0;
  let bottomConfirmationCount = 0;

  while (new Date().getTime() - startTime < TOTAL_DURATION) {
    for (let i = 0; i < FOLLOW_LIMIT; i++) {
      const FOLLOW_INTERVAL = Math.floor(Math.random() * 10 + 1) * 5000;

      let followButton = findVisibleFollowButton();

      if (!followButton) {
        console.log(
          `🔎 No visible Follow button right now. Scrolling a little... (tab: ${document.visibilityState})`
        );
        const canScrollMore = await scrollOneBatch();

        await delay(1000);

        followButton = findVisibleFollowButton();

        if (!followButton) {
          if (!canScrollMore) {
            bottomConfirmationCount++;
            console.log(
              `🔄 Scroll did not move. Confirming before calling it the bottom (${bottomConfirmationCount}/${BOTTOM_CONFIRMATIONS})...`
            );
            await delay(2000);
            followButton = findVisibleFollowButton();

            if (!followButton) {
              if (bottomConfirmationCount >= BOTTOM_CONFIRMATIONS) {
                console.log(
                  "🏁 Bottom confirmed. No more visible users to follow."
                );
                break;
              }

              continue;
            }
          } else {
            bottomConfirmationCount = 0;
            console.log("🧭 Scrolled, but no visible Follow button yet. Continuing...");
            continue;
          }
        }
      }

      bottomConfirmationCount = 0;
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
