---
author: aaron
pubDatetime: 2025-04-16T13:44:41.000-06:00
modDatetime:
title: Experimenting with XLA for kinematics
featured: true
draft: false
tags: []
description: A journey through time (a 1x1 scalar) and space (a 6x6 tensor)
---

I've been messing around with running kinematics simulations on the gpu.
It goes how you might expect it to.

## Table of contents

## motivation

I've been writing a space mission simulation engine for a while now. The idea is
to define a mission by its initial conditions, and then integrate out over a
long period of time to find out what happens.

The tough part about this is it's an iterative calculation; you can't estimate
the next time step until you've calculated what will happen in the current time step.
It's inherently difficult to gain significant speedups from parallelization.

And that's still difficult, but you can get _some_ performance from parallelizing.
The idea is within even time step, parallelize as much as humanly possible.
Traditionally this is accomplished by threading or multi-processing.
Instead I'm trying to use the gpu; because everyone loves gpus these days.

In comes Accelerated Linear Algebra, or "XLA" for short.

## what even is accelerated linear algebra (XLA)

tl;dr: it basically takes code you write, and runs it on the gpu.

jax is pretty popular; it takes python functions and runs them on the gpu.

it seems like magic, but what's really happening is it's re-interpreting
the functions you write into gpu code.

## kinematics

this is how "rigid body dynamics" works. there are different approaches, but the
one I'm using just multiplies quaternions with other things.

## results

basically what I've found is what everyone expects:

- cpu's are pretty fast as it is
- gpu calculations are dominated by cpu<->gpu transaction speed

using the cpu: ~40us per loop
using the gpu: ~40ms per loop

for context here are my machine specs: ...

So it's about 1000x slower to loop on the gpu.

But! the handy thing is we can do a ton more on the gpu without increasing the
loop time. So let's say we wanted to add multiple bodies, and flexible joint
interactions; the performance penalty on the cpu is roughly linear, but
the on the gpu it's roughly flat.

## where do we go from here

well that's interesting. how _much_ can we do on the gpu in a loop iteration?
i don't know, but i'm going to find out. I think the primary bottleneck will
be gpu memory amount and speed; the processors on the gpu are "wide" but not
wide enough to run everything in gpu memory - so for any instructions outside
the bounds of the gpu processors needs to get incrementally spooled in from gpu memory.
so at some point you're throwing really large datasets to the gpu, then the gpu
itself has to chunk them up; at which point you'll start seeing linear
processing time increases.

some interesting things you can do: the obvious one is to simulate multiple spacecraft.
which is a worthwhile thing to do! but the really interesting thing is expanding
the complexity of a single spacecraft's simulation. what i'd like to do is run
coupled simulations of the electrical, and thermal environments, alongside the
kinematics simulation.
