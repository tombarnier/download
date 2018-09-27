<template>
<div class="ui grid">
	<button class="ui button" v-on:click="updateSerie">
		<i class="rocket icon"></i>
		<span>Launch upadte</span>
	</button>
	<router-link :to="{ name: 'series' }" class="section" exact>Series</router-link>
	<h1>{{serie.name}}</h1>
	</br>
	<ul v-for="saison in serie.saisons" :key="saison.num"> 
		<li> Saison N°{{saison.num}} </li>
		<li>Qualité:{{saison.type}} </li>
		<li>Lang:{{saison.lang}} </li>
		<li>Lien:<a :href="saison.lien">{{saison.lien}}</a></li>
		<ul v-for="ep in saison.lien" :key="ep.episode">
			<li>Episode n°{{ep.episode}}</li>
			<li><a :href="ep.lien">{{ep.lien}}</a></li>
		</ul>
	</ul>
</div>
</template>

<script>
import { serieService } from '@/services'
import { serieLookup } from '@/services'
export default {
	name: 'serie',
	data (){
		return {
			serie: null
		}
	},
	beforeRouteEnter (to,from,next) {
		serieService.get(to.params.id).then((serie) => {
			next ((vm) => {
				vm.setSerie(serie)
			})
		}).catch((e) => {
			console.log(e)
			next({ name: 'series' })
		})
	},
	beforeRouteUpdate (to,from,next) {
		this.serie = null
		serieService.get(to.params.id).then((serie) => {
			this.setSerie(serie)
			next()
		}).catch((e) => {
			console.log(e)
			next({ name: 'series' })
		})
	},
	methods: {
		setSerie(serie) {
			this.serie = serie
		},
		updateSerie() {
			serieLookup.create({
				args: this.serie.lien
			}).then((response) => {
				console.log(response)
			});
		}
	}
}
</script>
