import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackerId, latitude, longitude, timestamp } = body;

    if (!trackerId || typeof trackerId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid tracker ID' },
        { status: 400 }
      );
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const locationTimestamp = timestamp ? new Date(timestamp) : new Date();

    // Get the last location for this tracker to check if we should add a new point
    const lastLocation = await prisma.trackerLocation.findFirst({
      where: { trackerId },
      orderBy: { timestamp: 'desc' },
    });

    // Only add if location has changed significantly (avoid duplicates)
    const shouldAdd = !lastLocation ||
      Math.abs(lastLocation.latitude - latitude) > 0.0001 ||
      Math.abs(lastLocation.longitude - longitude) > 0.0001;

    if (shouldAdd) {
      // Add to location history
      await prisma.trackerLocation.create({
        data: {
          trackerId,
          latitude,
          longitude,
          timestamp: locationTimestamp,
        },
      });
    }

    // Update or create the current tracker state
    await prisma.trackerState.upsert({
      where: { trackerId },
      update: {
        latitude,
        longitude,
        timestamp: locationTimestamp,
      },
      create: {
        trackerId,
        latitude,
        longitude,
        timestamp: locationTimestamp,
      },
    });

    return NextResponse.json({
      success: true,
      trackerId,
      location: { latitude, longitude, timestamp: locationTimestamp }
    });
  } catch (error) {
    console.error('Error storing location:', error);
    return NextResponse.json(
      { error: 'Failed to store location' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackerId = searchParams.get('trackerId');

    // If trackerId is specified, return that tracker's location
    if (trackerId) {
      const state = await prisma.trackerState.findUnique({
        where: { trackerId },
      });

      if (!state) {
        return NextResponse.json(
          { error: 'No location data available for this tracker' },
          { status: 404 }
        );
      }

      // Check if location is stale (older than 5 minutes)
      const isStale = Date.now() - state.timestamp.getTime() > 5 * 60 * 1000;

      // Get history for this tracker
      const history = await prisma.trackerLocation.findMany({
        where: { trackerId },
        orderBy: { timestamp: 'asc' },
        take: 1000, // Limit to last 1000 points
      });

      return NextResponse.json({
        trackerId,
        location: {
          latitude: state.latitude,
          longitude: state.longitude,
          timestamp: state.timestamp.getTime(),
        },
        stale: isStale,
        history: history.map(h => ({
          latitude: h.latitude,
          longitude: h.longitude,
          timestamp: h.timestamp.getTime(),
        })),
      });
    }

    // Otherwise, return all tracker locations
    const allStates = await prisma.trackerState.findMany();

    if (allStates.length === 0) {
      return NextResponse.json({ trackers: [] });
    }

    // Get all trackers with their history
    const allTrackers = await Promise.all(
      allStates.map(async (state) => {
        const history = await prisma.trackerLocation.findMany({
          where: { trackerId: state.trackerId },
          orderBy: { timestamp: 'asc' },
          take: 1000, // Limit to last 1000 points
        });

        // Check if location is stale (older than 5 minutes)
        const isStale = Date.now() - state.timestamp.getTime() > 5 * 60 * 1000;

        return {
          trackerId: state.trackerId,
          location: {
            latitude: state.latitude,
            longitude: state.longitude,
            timestamp: state.timestamp.getTime(),
          },
          stale: isStale,
          history: history.map(h => ({
            latitude: h.latitude,
            longitude: h.longitude,
            timestamp: h.timestamp.getTime(),
          })),
        };
      })
    );

    return NextResponse.json({ trackers: allTrackers });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackerId = searchParams.get('trackerId');

    if (trackerId) {
      // Delete specific tracker data
      await prisma.trackerLocation.deleteMany({
        where: { trackerId },
      });
      await prisma.trackerState.delete({
        where: { trackerId },
      });

      return NextResponse.json({
        success: true,
        message: `Tracker ${trackerId} reset successfully`,
      });
    } else {
      // Delete all tracker data
      await prisma.trackerLocation.deleteMany({});
      await prisma.trackerState.deleteMany({});

      return NextResponse.json({
        success: true,
        message: 'All trackers reset successfully',
      });
    }
  } catch (error) {
    console.error('Error resetting trackers:', error);
    return NextResponse.json(
      { error: 'Failed to reset trackers' },
      { status: 500 }
    );
  }
}
