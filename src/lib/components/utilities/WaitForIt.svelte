<script>
	import { crossfade } from 'svelte/transition';

	export let waitOn = true;

	export function run(asyncFn, ...args) {
		waitOn = asyncFn(...args).then((res) => res);
	}

	export function prep(asyncFn) {
		return run.bind(null, asyncFn);
	}

	const key = Symbol();
	const [send, receive] = crossfade({
		duration: 250
	});
</script>

<span class="waitforit-cont">
	{#await waitOn}
		<div in:send={key} out:receive={key}>
			<slot name="loader" />
		</div>
	{:then res}
		{#if !waitOn}
			<div in:send={key} out:receive={key}>
				<slot name="loader" />
			</div>
		{:else}
			<div in:send={key} out:receive={key}>
				<slot name="content" />
			</div>
		{/if}
	{/await}
</span>

<style>
	* {
		display: contents;
	}

	.waitforit-cont {
		position: relative;
	}

	div {
		position: absolute;
	}
</style>
