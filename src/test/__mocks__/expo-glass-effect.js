const React = require('react');
const { View } = require('react-native');

const GlassView = ({ children, style, ...props }) =>
  React.createElement(View, { style, ...props }, children);

const GlassContainer = ({ children, style, ...props }) =>
  React.createElement(View, { style, ...props }, children);

const isLiquidGlassAvailable = () => false;
const isGlassEffectAPIAvailable = () => false;

module.exports = { GlassView, GlassContainer, isLiquidGlassAvailable, isGlassEffectAPIAvailable };
