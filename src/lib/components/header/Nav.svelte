<script>
	import { page } from '$app/stores';
	import { user } from '../../stores/user';
	import * as siteMap from '../../utils/siteMap';

	import NavItem from './NavItem.svelte';

	$: isBandPage = !!$page.params.band;
	$: showUserLinks = !!$user && !isBandPage;

	$: links = [
		{
			show: showUserLinks,
			title: 'Profile',
			href: siteMap.userProfile
		},
		{
			show: showUserLinks,
			title: 'Bands',
			href: siteMap.userBands,
			next:
				$user &&
				$user.bands
					.map((band) => ({
						show: true,
						title: band.band.name,
						href: siteMap.band(band.band.webSafeName)
					}))
					.concat({
						show: true,
						title: 'New Band',
						href: siteMap.newBand
					})
		},
		{
			show: isBandPage,
			title: 'Set Lists',
			href: siteMap.band($page.params.band),
			next: $user !== null && [
				{
					show: true,
					title: 'New Set List',
					href: siteMap.newList($page.params.band)
				}
			]
		},
		{
			show: isBandPage,
			title: 'Repertoire',
			href: siteMap.repertoire($page.params.band)
		}
	];
</script>

<nav class="flex">
	<ul class="flex">
		{#each links as link}
			{#if link.show}
				<NavItem {...link} />
			{/if}
		{/each}
	</ul>
</nav>

<style>
	nav {
		height: 100%;
		font-size: 1.5rem;
		flex-grow: 2;
		justify-content: flex-end;
	}

	ul {
		width: min-content;
		height: 100%;
		justify-content: flex-end;
	}
</style>
