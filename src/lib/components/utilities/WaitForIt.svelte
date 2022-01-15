<script>
	export let waitOn = true;

	export function run(asyncFn, ...args) {
		waitOn = asyncFn(...args).then((res) => res);
	}

	export function prep(asyncFn) {
		return run.bind(null, asyncFn);
	}
</script>

<span class="waitforit-cont">
	{#await waitOn}
		<div>
			<slot name="loader" />
		</div>
	{:then res}
		{#if !waitOn}
			<div>
				<slot name="loader" />
			</div>
		{:else}
			<div>
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
