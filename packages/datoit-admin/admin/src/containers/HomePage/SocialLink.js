/**
 *
 * SocialLink
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Gh from '../../assets/images/social_gh.png';
import Discord from '../../assets/images/social_discord.png';
import Twitter from '../../assets/images/social_twitter.png';
import Reddit from '../../assets/images/social_reddit.png';
import Strapi from '../../assets/images/social_datoit.png';

import { SocialLinkWrapper } from './components';

function getSrc(name) {
  switch (name) {
    case 'GitHub':
      return Gh;
    case 'Reddit':
      return Reddit;
    case 'Discord':
      return Discord;
    case 'Twitter':
      return Twitter;
    case 'Blog':
    case 'Forum':
    case 'Careers':
      return Strapi;
    default:
      return Strapi;
  }
}

const SocialLink = ({ link, name }) => {
  return (
    <SocialLinkWrapper className="col-6">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={getSrc(name)} alt={name} />
        <span>{name}</span>
      </a>
    </SocialLinkWrapper>
  );
};

SocialLink.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default memo(SocialLink);
