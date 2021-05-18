<script>
	import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle
  } from 'sveltestrap';
</script>

<main>
	<h1>
		<strong>SOS2021-21</strong>
	</h1>

	<h2>Equipo:</h2>

	<Card class="mb-3">
		<CardHeader><a href="https://github.com/youssefld">Youssef Lakouifat Darkaoui</a></CardHeader>
		<CardBody>
			<CardSubtitle>API Desarrollada</CardSubtitle>
			<CardText>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v1/fire-stats">
						fire-stats-v1
					</a>
				</li>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v2/fire-stats">
						fire-stats-v2
					</a>
				</li>
			</CardText>
			<CardSubtitle>Documentación</CardSubtitle>
			<CardText>
				<li>
					<a href="https://documenter.getpostman.com/view/15295048/TzJoDg5q">
						fire-stats-v1
					</a>
				</li>
				<li>
					<a href="https://documenter.getpostman.com/view/15295048/TzRXA69g">
						fire-stats-v2
					</a>
				</li>
			</CardText>

			<Button color="light"><a href="#/fire">Frontend</a></Button>

		</CardBody>
	</Card>

	<Card class="mb-3">
		<CardHeader><a href="https://github.com/pauleasal">Paula Leal Salvago</a></CardHeader>
		<CardBody>
			<CardSubtitle>API Desarrollada</CardSubtitle>
			<CardText>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v1/temperature-stats">
						temperature-stats-v1
					</a>
				</li>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v2/temperature-stats">
						temperature-stats-v2
					</a>
				</li>
			</CardText>
			<CardSubtitle>Documentación</CardSubtitle>
			<CardText>
				<li>
					<a href="https://documenter.getpostman.com/view/15351242/TzJoDzxY">
						temperature-stats-v1
					</a>
				</li>
				<li>
					<a href="https://documenter.getpostman.com/view/15351242/TzRXA69d">
						temperature-stats-v2
					</a>
				</li>
			</CardText>

			<Button color="light"><a href="#/temperature">Frontend</a></Button>

		</CardBody>
	</Card>

	<Card class="mb-3">
		<CardHeader><a href="https://github.com/alesolmer">Alejandro Solís Mercado</a></CardHeader>
		<CardBody>
			<CardSubtitle>API Desarrollada</CardSubtitle>
			<CardText>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v1/emision-stats">
						emision-stats-v1
					</a>
				</li>
				<li>
					<a href="https://sos2021-21.herokuapp.com/api/v2/emision-stats">
						emision-stats-v2
					</a>
				</li>
			</CardText>
			<CardSubtitle>Documentación</CardSubtitle>
			<CardText>
				<li>
					<a href="https://documenter.getpostman.com/view/14950243/TzJoFMLe">
						emision-stats-v1
					</a>
				</li>
				<li>
					<a href="https://documenter.getpostman.com/view/14950243/TzRXAS64">
						emision-stats-v2
					</a>
				</li>
			</CardText>

			<Button color="light"><a href="#/emision">Frontend</a></Button>

		</CardBody>
	</Card>

	
	<h2>Descripción del proyecto:</h2>
	<p>
		Analizar el número de incendios en relación con el cambio climático y la
		variación de temperatura en diferentes países del mundo.
	</p>
	<h2>Repositorio:</h2>
	<p>
		<a href="https://github.com/gti-sos/SOS2021-21">[gti-sos/SOS2021-21]</a>
	</p>
	<h2>URL:</h2>
	<p>
		<a href="http://sos2021-21.herokuapp.com">http://sos2021-21.herokuapp.com</a>
	</p>
	
</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #00a2ff;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
