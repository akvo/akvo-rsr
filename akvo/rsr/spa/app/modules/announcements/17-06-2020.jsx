import React from 'react'
import { Button } from 'antd'

export default () => (
  <div>
    <h1>{'New features for a crisp, clear and colourful overview of your programme\'s progress'}</h1>
    <p>
      Check out these three new features to ease your programme management work. At a glance, you can now easily see:
    </p>
    <ul>
      <li>How many projects you have in any location</li>
      <li>How your programme is performing, and</li>
      <li>All of your programme’s contributing projects</li>
    </ul>
    <section>
      <h1>Need to see how many projects you have in a certain location? <span role="img" aria-label="map">🗺️</span></h1>
      <p>With the new homepage design, you can easily see the number of projects in any given location. We’ve also improved the filtering function, allowing you to get a solid overview of your projects in no time.</p>
      <Button type="primary">Check it out</Button>
    </section>
    <h1>
      Find out how your programme is
      performing at a glance <span role="img" aria-label="look">👀</span>
    </h1>
    <p>This new programme overview feature gives M&E and programme managers a clear and colourful overview of their programme’s aggregated results data.<br /><br />
It means you can easily see how your programme is performing in relation to your results framework.
    </p>
    <Button type="primary">Check it out</Button>
    <section>
      <h1>See your aggregated data clearly,
easily and beautifully <span role="img" aria-label="color">🎨</span>
      </h1>
      <p>This new programme hierarchy feature goes hand in hand with the programme overview feature. M&E and programme managers can now clearly see each programme’s contributing projects at each level.</p>
      <p>You can also directly add a new project to your programme from the hierarchy page - the validation set and core results framework will automatically be inherited. </p>
      <Button type="primary">Check it out</Button>
    </section>

    <h1>Bonus feature: Check out our new
user access feature <span role="img" aria-label="check">🤓</span>
    </h1>
    <p>Tucked away in section three of the project editor (partners and user access), you’ll find the fine access control feature. This allows project administrators to set project access to users from their own organisation or RSR users from a partner organisation. </p>
    <Button type="primary">Check it out</Button>
  </div>
)
