<template>
	<div class="mt-4">
		<h1 class="mb-3">Leaderboard <i class="bi bi-trophy-fill text-warning ms-2"/></h1>
		<div v-for="(user, rank) in lb" class="card mb-2" :key="user.id">
			<div class="card-header d-flex justify-content-between w-100">
				<h2 :class="`card-title m-0 text-${getColor(rank + 1, 'rank')}`">
					#{{ rank + 1 }}
				</h2>
				<h2 class="card-title m-0">
					<router-link class="nav-link text-primary" :to="`/profile/${user.id}`">{{ user.nickname }}</router-link>
				</h2>
			</div>
			<div class="card-content row p-2">
				<div class="col-4 d-flex-col">
              		<h5>Winrate</h5>
					<h5 :class="`card-subtitle text-${getColor(user.winRate, 'wr')}`">{{ user.winRate.toFixed(2) }}%</h5>
				</div>
				<div class="col-4 d-flex-col">
              		<h5>Won</h5>
					<h5 class="card-subtitle text-muted">{{ user.gamesWon }} games</h5>
				</div>
				<div class="col-4 d-flex-col">
              		<h5>Played</h5>
					<h5 class="card-subtitle text-muted">{{ user.gamesPlayed }} games</h5>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { sendBackendRequest } from "@/utils/user";
import { ref, onMounted } from "vue";

const lb = ref(null);

function getColor(n: number, type: string) {
	console.log(n);
	if (type === 'wr') {
		if (n > 70) return 'success';
		if (n > 50) return 'primary';
		if (n > 30) return 'warning';
		return 'danger';
	} else if (type === 'rank') {
		if (n === 1) return 'gold';
		if (n === 2) return 'silver';
		if (n === 3) return 'bronze';
		return 'dark';
	} else return 'secondary';
}

async function refreshGames() {
	const r = await sendBackendRequest('/users/leaderboard');
	if (r.status === 'success')
		lb.value = r.payload;
}

onMounted(() => refreshGames());
</script>

<style scoped>
.text-gold {
	color: gold;
}

.text-silver {
	color: silver;
}

.text-bronze {
	color: #A05822;
}
</style>