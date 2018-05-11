import React from 'react';

import Button from './Button';

export default function HomePage() {
	return (
		<div style={{ maxWidth: '90%', margin: 'auto' }}>
			<div style={{ textAlign: 'center' }}>
	      <h1>
	      	Rock, Paper, Scissors
	      </h1>
	    </div>
	    <div>
	    	<div style={{ display: 'inline-block', maxWidth: '33%' }}>
	    		<img width="100%" src="https://i.imgur.com/4JnbeAm.png" />
	    	</div>
	    	<div style={{ display: 'inline-block', maxWidth: '33%' }}>
	    		<img width="100%" src="https://images.vexels.com/media/users/3/128601/isolated/preview/adea4e2cdcac05cab39a471f7cd7178d-red-rectangular-origami-banner-by-vexels.png" />
	    	</div>
	    	<div style={{ display: 'inline-block', maxWidth: '33%' }}>
	    		<img width="100%" src="http://www.pngmart.com/files/1/Scissors-PNG-Free-Download.png" />
	    	</div>
	    </div>
	    <div style={{ textAlign: 'center', paddingTop: 40 }}>
	    	<Button>Begin</Button>
	    </div>
		</div>
	);
}
