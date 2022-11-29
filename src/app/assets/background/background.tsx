import { Box } from '@chakra-ui/react';

const Layers = () => {
  return (
    <>
      <Box
        position="fixed"
        top="0px"
        left={{ base: '-100px', md: '0px' }}
        zIndex="-1000"
      >
        <svg
          width="778"
          height="680"
          viewBox="0 0 778 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="-11.5"
            cy="-54.5"
            rx="789.5"
            ry="734.5"
            fill="url(#paint0_radial_2135_9651)"
            fillOpacity="0.13"
          />
          <defs>
            <radialGradient
              id="paint0_radial_2135_9651"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-11.5 -54.5) rotate(90) scale(734.5 789.5)"
            >
              <stop stopColor="#6CCAE8" />
              <stop offset="1" stopColor="#5ECFD7" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </Box>
    </>
  );
};

export default Layers;
