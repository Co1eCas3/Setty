<form class="flex stack" on:submit|preventDefault>
	<slot />
</form>

<style>
	form {
		width: var(--form__cont-width, var(--size-content-3, 60ch));
		height: var(--form__cont-height, auto);
		aspect-ratio: var(--ratio-landscape, default);
		padding: var(--form__cont-pad, var(--size-7, 2rem));
		border: var(--form__border, default);
		border-radius: var(--form__border-rad, var(--radius-3, 0.5rem));
		background-color: var(--form__cont-bg, none);
	}
</style>
