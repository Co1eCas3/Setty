<script context="module">
	import siteMap from '$lib/utils/siteMap';

	export function load() {
		return {
			status: 301,
			redirect: siteMap.userAccount
		};
	}
</script>
