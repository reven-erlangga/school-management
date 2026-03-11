<script lang="ts">
    import { stage, Stage } from "../../stores/stage.store";
    import GeneralVisual from "./_sections/GeneralVisual.svelte";
    import MailServerVisual from "./_sections/MailServerVisual.svelte";
    import XenditVisual from "./_sections/XenditVisual.svelte";
    import SeedingVisual from "./_sections/SeedingVisual.svelte";
</script>

<div class="hidden lg:block w-full h-full relative">
    <div
        class="absolute inset-0 transition-opacity duration-300"
        class:opacity-100={$stage === Stage.General}
        class:opacity-0={$stage !== Stage.General}
        class:pointer-events-none={$stage !== Stage.General}
    >
        <GeneralVisual />
    </div>

    <div
        class="absolute inset-0 transition-opacity duration-300"
        class:opacity-100={$stage === Stage.MailServer}
        class:opacity-0={$stage !== Stage.MailServer}
        class:pointer-events-none={$stage !== Stage.MailServer}
    >
        <MailServerVisual />
    </div>

    <div
        class="absolute inset-0 transition-opacity duration-300"
        class:opacity-100={$stage === Stage.Xendit}
        class:opacity-0={$stage !== Stage.Xendit}
        class:pointer-events-none={$stage !== Stage.Xendit}
    >
        <XenditVisual />
    </div>

    <div
        class="absolute inset-0 transition-opacity duration-300"
        class:opacity-100={$stage === Stage.Seeding}
        class:opacity-0={$stage !== Stage.Seeding}
        class:pointer-events-none={$stage !== Stage.Seeding}
    >
        <SeedingVisual />
    </div>

</div>
