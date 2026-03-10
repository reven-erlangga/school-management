<script module lang="ts">
    import StepIndicator from "@components/svelte/atoms/StepIndicator.svelte";
    import GeneralForm from "./_sections/GeneralForm.svelte";
    import MailServerForm from "./_sections/MailServerForm.svelte";
    import SuperUserForm from "./_sections/SuperUserForm.svelte";
    import Card from "@components/svelte/atoms/Card.svelte";
    import Button from "@components/svelte/atoms/Button.svelte";
    import Icon from "@components/svelte/atoms/Icon.svelte";
</script>

<script lang="ts">
    import { fade } from "svelte/transition";
    import { stage, Stage } from "../../stores/stage.store";
    import { steps } from "../../const/step.const";
    import { generalForm } from "../../stores/general-form.store";
    import { serverForm } from "../../stores/server-form.store";
    import { superuserForm } from "../../stores/superuser-form.store";
</script>

<div class="px-8 w-full h-full flex items-center justify-center">
    <div class="w-full max-w-2xl">
        <Card class="w-full" headerPadding="p-0" contentPadding="p-0">
            {#snippet header()}<StepIndicator
                    items={steps}
                    activeId={$stage}
                />{/snippet}
            {#snippet children()}
                {#if $stage === Stage.General}
                    <GeneralForm />
                {:else if $stage === Stage.MailServer}
                    <MailServerForm />
                {:else if $stage === Stage.SuperUser}
                    <SuperUserForm />
                {:else}
                    <div
                        class="p-12 flex flex-col items-center justify-center text-center space-y-4"
                        in:fade={{ duration: 300 }}
                    >
                        <div
                            class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center"
                        >
                            <Icon name="check" size="24" />
                        </div>
                        <h3
                            class="text-xl font-extrabold text-slate-900 dark:text-slate-100"
                        >
                            Inisialisasi Berhasil
                        </h3>
                        <p
                            class="text-[13px] font-medium text-slate-600 dark:text-slate-400"
                        >
                            Semua konfigurasi dasar telah disimpan.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            class="px-8"
                            onclick={() =>
                                (window.location.href = "/admin/dashboard")}
                            >Go to Dashboard</Button
                        >
                    </div>
                {/if}
            {/snippet}
            {#snippet footer()}
                {#if $stage === Stage.General}
                    <div class="flex items-center justify-end">
                        <Button
                            variant="primary"
                            size="lg"
                            onclick={generalForm.submit}
                            disabled={$generalForm.meta.loading}
                            class="px-8"
                        >
                            {$generalForm.meta.loading ? "Saving..." : "Next"}
                        </Button>
                    </div>
                {:else if $stage === Stage.MailServer}
                    <div class="flex items-center justify-between">
                        <Button variant="ghost" onclick={() => stage.back()}
                            >Back</Button
                        >
                        <Button
                            variant="primary"
                            size="lg"
                            onclick={serverForm.submit}
                            disabled={$serverForm.meta.loading}
                            class="px-8"
                        >
                            {$serverForm.meta.loading ? "Saving..." : "Next"}
                        </Button>
                    </div>
                {:else if $stage === Stage.SuperUser}
                    <div class="flex items-center justify-between">
                        <Button variant="ghost" onclick={() => stage.back()}
                            >Back</Button
                        >
                        <Button
                            variant="primary"
                            size="lg"
                            onclick={superuserForm.submit}
                            disabled={$superuserForm.meta.loading}
                            class="px-8"
                        >
                            {$superuserForm.meta.loading
                                ? "Saving..."
                                : "Finish Setup"}
                        </Button>
                    </div>
                {/if}
            {/snippet}
        </Card>
    </div>
</div>
