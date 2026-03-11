<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { onMount, tick } from "svelte";
  import TextField from "@components/svelte/atoms/TextField.svelte";
  import Switch from "@components/svelte/atoms/Switch.svelte";
  import { xenditForm } from "../../../stores/xendit-form.store";

  const { handleInput, toggleEnabled, setPaymentMode, loadData } = xenditForm;

  let dynamicContainer: HTMLDivElement | null = null;
  let heightLockActive = $state(false);
  let lockedHeight = $state(0);
  let swapActive = $state(false);
  let heightLockId = 0;

  let uiEnabled = $state(false);
  let uiPaymentMode = $state<"manual" | "xendit">("manual");

  $effect(() => {
    if (swapActive) return;
    uiEnabled = $xenditForm.values.enabled;
    uiPaymentMode = $xenditForm.values.paymentMode;
  });

  const animateSwapUI = async (applyUI: () => void, duration = 260) => {
    const el = dynamicContainer;
    if (!el) {
      applyUI();
      return;
    }

    const lockId = ++heightLockId;
    heightLockActive = true;
    lockedHeight = el.offsetHeight;

    swapActive = true;

    if (lockId !== heightLockId) return;

    applyUI();
    await tick();

    const nextHeight = el.scrollHeight;
    if (nextHeight === lockedHeight) {
      swapActive = false;
      heightLockActive = false;
      return;
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    lockedHeight = nextHeight;
    swapActive = false;

    window.setTimeout(() => {
      if (lockId === heightLockId) {
        heightLockActive = false;
      }
    }, duration);
  };

  const toggleEnabledAnimated = async (enabled: boolean) => {
    toggleEnabled(enabled);
    await animateSwapUI(() => {
      uiEnabled = enabled;
      uiPaymentMode = enabled ? $xenditForm.values.paymentMode : "manual";
    });
  };

  const setPaymentModeAnimated = async (mode: "manual" | "xendit") => {
    setPaymentMode(mode);
    await animateSwapUI(() => {
      uiPaymentMode = mode;
    });
  };

  onMount(() => {
    loadData();
  });
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  {#if $xenditForm.meta.error}
    <div
      class="p-4 rounded-2xl border border-rose-200/70 bg-rose-50 text-rose-700 text-[13px] font-semibold"
      in:fly={{ y: -6, duration: 220 }}
      out:fade={{ duration: 160 }}
    >
      {$xenditForm.meta.error}
    </div>
  {/if}

  <div
    class="flex items-center justify-between gap-6 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900"
  >
    <div class="space-y-1">
      <div class="text-[13px] font-black text-slate-900 dark:text-slate-100">
        Integrasi Xendit
      </div>
      <div class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
        OFF: manual saja. ON: pilih default Xendit atau hybrid (Xendit + manual).
      </div>
    </div>

    <Switch
      size="md"
      dataTestid="xendit-enabled-switch"
      checked={$xenditForm.values.enabled}
      onValueChange={(val) => toggleEnabledAnimated(val)}
    />
  </div>

  <div
    bind:this={dynamicContainer}
    style="height: {heightLockActive ? `${lockedHeight}px` : 'auto'}; overflow: {heightLockActive ? 'hidden' : 'visible'}; transition: height 260ms cubic-bezier(0.22, 1, 0.36, 1);"
    class="space-y-6"
  >
    <div
      style="opacity: {swapActive ? 0 : 1}; transform: translateY({swapActive ? 6 : 0}px); transition: opacity 140ms ease, transform 200ms ease;"
      class="space-y-6"
    >
      {#if !uiEnabled}
        <div
          class="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-900"
          in:fade={{ duration: 180 }}
        >
          <div class="text-[13px] font-bold text-slate-800 dark:text-slate-200">
            Pembayaran berjalan manual
          </div>
          <div class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
            Sistem tidak akan bergantung pada Xendit untuk proses pembayaran.
          </div>
        </div>
      {:else}
        <div class="space-y-4">
          <div class="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Payment Mode
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              class="p-5 rounded-2xl border-2 cursor-pointer transition-all
                {uiPaymentMode === 'xendit'
                  ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/10'
                  : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:border-slate-300/70 dark:hover:border-slate-600/70'}"
              in:scale={{ start: 0.98, duration: 180 }}
            >
              <input
                type="radio"
                name="paymentMode"
                class="sr-only"
                checked={uiPaymentMode === 'xendit'}
                onchange={() => setPaymentModeAnimated('xendit')}
                data-testid="xendit-mode-auto"
              />
              <div class="space-y-1">
                <div class="text-[13px] font-black text-slate-900 dark:text-slate-100">
                  Otomatis via Xendit
                </div>
                <div class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  Pembayaran diproses otomatis dengan integrasi Xendit.
                </div>
              </div>
            </label>

            <label
              class="p-5 rounded-2xl border-2 cursor-pointer transition-all
                {uiPaymentMode === 'manual'
                  ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/10'
                  : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:border-slate-300/70 dark:hover:border-slate-600/70'}"
              in:scale={{ start: 0.98, duration: 180 }}
            >
              <input
                type="radio"
                name="paymentMode"
                class="sr-only"
                checked={uiPaymentMode === 'manual'}
                onchange={() => setPaymentModeAnimated('manual')}
                data-testid="xendit-mode-manual"
              />
              <div class="space-y-1">
                <div class="text-[13px] font-black text-slate-900 dark:text-slate-100">
                  Xendit + Manual
                </div>
                <div class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  Terima pembayaran dari Xendit dan juga input pembayaran manual.
                </div>
              </div>
            </label>
          </div>
        </div>

        {#if uiPaymentMode === "manual"}
          <div
            class="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-900"
            in:fade={{ duration: 180 }}
          >
            <div class="text-[13px] font-bold text-slate-800 dark:text-slate-200">
              Mode hybrid aktif
            </div>
            <div class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              Sistem menerima pembayaran dari Xendit dan juga pembayaran manual (fallback).
            </div>
          </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fly={{ y: 8, duration: 220 }}>
          <TextField
            id="xendit_api_key"
            label="API KEY"
            placeholder="Enter Xendit API key"
            value={$xenditForm.values.apiKey}
            error={$xenditForm.errors.apiKey}
            required
            onValueChange={(val) => handleInput("apiKey", val)}
          />
          <TextField
            id="xendit_secret_key"
            label="SECRET KEY"
            placeholder="Enter Xendit secret/webhook secret"
            type="password"
            value={$xenditForm.values.secretKey}
            error={$xenditForm.errors.secretKey}
            required
            onValueChange={(val) => handleInput("secretKey", val)}
          />
        </div>

        <div in:fly={{ y: 8, duration: 220 }}>
          <TextField
            id="xendit_webhook_url"
            label="WEBHOOK URL"
            placeholder="https://your-domain.com/api/xendit/webhook"
            value={$xenditForm.values.webhookUrl}
            error={$xenditForm.errors.webhookUrl}
            required
            onValueChange={(val) => handleInput("webhookUrl", val)}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
