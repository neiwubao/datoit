import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import {
  request,
  useGlobalContext,
  formatComponentData,
  useQueryParams,
} from 'datoit-helper-plugin';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createDefaultForm, getTrad, removePasswordFieldsFromData } from '../../utils';
import {
  getData,
  getDataSucceeded,
  initForm,
  resetProps,
  setDataStructures,
  setStatus,
  submitSucceeded,
} from '../../sharedReducers/crudReducer/actions';
import selectCrudReducer from '../../sharedReducers/crudReducer/selectors';
import { getRequestUrl } from './utils';
import buildQueryString from '../ListView/utils/buildQueryString';

// This container is used to handle the CRUD
const SingleTypeFormWrapper = ({ allLayoutData, children, slug }) => {
  const { emitEvent } = useGlobalContext();
  const { push } = useHistory();
  const emitEventRef = useRef(emitEvent);
  const [isCreatingEntry, setIsCreatingEntry] = useState(true);
  const [{ query, rawQuery }] = useQueryParams();
  const searchToSend = buildQueryString(query);

  const dispatch = useDispatch();
  const {
    componentsDataStructure,
    contentTypeDataStructure,
    data,
    isLoading,
    status,
  } = useSelector(selectCrudReducer);

  const cleanReceivedData = useCallback(
    data => {
      const cleaned = removePasswordFieldsFromData(
        data,
        allLayoutData.contentType,
        allLayoutData.components
      );

      // This is needed in order to add a unique id for the repeatable components, in order to make the reorder easier
      return formatComponentData(cleaned, allLayoutData.contentType, allLayoutData.components);
    },
    [allLayoutData]
  );

  useEffect(() => {
    return () => {
      dispatch(resetProps());
    };
  }, [dispatch]);

  useEffect(() => {
    const componentsDataStructure = Object.keys(allLayoutData.components).reduce((acc, current) => {
      const defaultComponentForm = createDefaultForm(
        get(allLayoutData, ['components', current, 'attributes'], {}),
        allLayoutData.components
      );

      acc[current] = formatComponentData(
        defaultComponentForm,
        allLayoutData.components[current],
        allLayoutData.components
      );

      return acc;
    }, {});

    const contentTypeDataStructure = createDefaultForm(
      allLayoutData.contentType.attributes,
      allLayoutData.components
    );
    const contentTypeDataStructureFormatted = formatComponentData(
      contentTypeDataStructure,
      allLayoutData.contentType,
      allLayoutData.components
    );

    dispatch(setDataStructures(componentsDataStructure, contentTypeDataStructureFormatted));
  }, [allLayoutData, dispatch]);

  // Check if creation mode or editing mode
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async signal => {
      dispatch(getData());

      setIsCreatingEntry(true);

      try {
        const data = await request(getRequestUrl(`${slug}${searchToSend}`), {
          method: 'GET',
          signal,
        });

        dispatch(getDataSucceeded(cleanReceivedData(data)));

        setIsCreatingEntry(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        const responseStatus = get(err, 'response.status', null);

        // Creating a single type
        if (responseStatus === 404) {
          dispatch(initForm(rawQuery, true));
        }

        if (responseStatus === 403) {
          strapi.notification.info(getTrad('permissions.not-allowed.update'));

          push('/');
        }
      }
    };

    fetchData(signal);

    return () => abortController.abort();
  }, [cleanReceivedData, push, slug, dispatch, searchToSend, rawQuery]);

  const displayErrors = useCallback(err => {
    const errorPayload = err.response.payload;
    console.error(errorPayload);

    let errorMessage = get(errorPayload, ['message'], 'Bad Request');

    // TODO handle errors correctly when back-end ready
    if (Array.isArray(errorMessage)) {
      errorMessage = get(errorMessage, ['0', 'messages', '0', 'id']);
    }

    if (typeof errorMessage === 'string') {
      strapi.notification.error(errorMessage);
    }
  }, []);

  const onDelete = useCallback(
    async trackerProperty => {
      try {
        emitEventRef.current('willDeleteEntry', trackerProperty);

        const response = await request(getRequestUrl(`${slug}`), {
          method: 'DELETE',
        });

        strapi.notification.success(getTrad('success.record.delete'));

        emitEventRef.current('didDeleteEntry', trackerProperty);

        return Promise.resolve(response);
      } catch (err) {
        emitEventRef.current('didNotDeleteEntry', { error: err, ...trackerProperty });

        return Promise.reject(err);
      }
    },
    [slug]
  );

  const onDeleteSucceeded = useCallback(() => {
    setIsCreatingEntry(true);

    dispatch(initForm(rawQuery, true));
  }, [dispatch, rawQuery]);

  const onPost = useCallback(
    async (body, trackerProperty) => {
      const endPoint = getRequestUrl(`${slug}${rawQuery}`);

      try {
        dispatch(setStatus('submit-pending'));

        const response = await request(endPoint, { method: 'PUT', body });

        emitEventRef.current('didCreateEntry', trackerProperty);
        strapi.notification.toggle({
          type: 'success',
          message: { id: getTrad('success.record.save') },
        });

        dispatch(submitSucceeded(cleanReceivedData(response)));
        setIsCreatingEntry(false);

        dispatch(setStatus('resolved'));
      } catch (err) {
        emitEventRef.current('didNotCreateEntry', { error: err, trackerProperty });

        displayErrors(err);

        dispatch(setStatus('resolved'));
      }
    },
    [cleanReceivedData, displayErrors, slug, dispatch, rawQuery]
  );
  const onPublish = useCallback(async () => {
    try {
      emitEventRef.current('willPublishEntry');
      const endPoint = getRequestUrl(`${slug}/actions/publish${searchToSend}`);

      dispatch(setStatus('publish-pending'));

      const data = await request(endPoint, { method: 'POST' });

      emitEventRef.current('didPublishEntry');
      strapi.notification.toggle({
        type: 'success',
        message: { id: getTrad('success.record.publish') },
      });

      dispatch(submitSucceeded(cleanReceivedData(data)));

      dispatch(setStatus('resolved'));
    } catch (err) {
      displayErrors(err);

      dispatch(setStatus('resolved'));
    }
  }, [cleanReceivedData, displayErrors, slug, searchToSend, dispatch]);

  const onPut = useCallback(
    async (body, trackerProperty) => {
      const endPoint = getRequestUrl(`${slug}${rawQuery}`);

      try {
        emitEventRef.current('willEditEntry', trackerProperty);

        dispatch(setStatus('submit-pending'));

        const response = await request(endPoint, { method: 'PUT', body });

        strapi.notification.toggle({
          type: 'success',
          message: { id: getTrad('success.record.save') },
        });

        emitEventRef.current('didEditEntry', { trackerProperty });

        dispatch(submitSucceeded(cleanReceivedData(response)));

        dispatch(setStatus('resolved'));
      } catch (err) {
        displayErrors(err);

        emitEventRef.current('didNotEditEntry', { error: err, trackerProperty });

        dispatch(setStatus('resolved'));
      }
    },
    [cleanReceivedData, displayErrors, slug, dispatch, rawQuery]
  );

  // The publish and unpublish method could be refactored but let's leave the duplication for now
  const onUnpublish = useCallback(async () => {
    const endPoint = getRequestUrl(`${slug}/actions/unpublish${searchToSend}`);

    dispatch(setStatus('unpublish-pending'));

    try {
      emitEventRef.current('willUnpublishEntry');

      const response = await request(endPoint, { method: 'POST' });

      emitEventRef.current('didUnpublishEntry');
      strapi.notification.success(getTrad('success.record.unpublish'));

      dispatch(submitSucceeded(cleanReceivedData(response)));

      dispatch(setStatus('resolved'));
    } catch (err) {
      dispatch(setStatus('resolved'));
      displayErrors(err);
    }
  }, [cleanReceivedData, displayErrors, slug, dispatch, searchToSend]);

  return children({
    componentsDataStructure,
    contentTypeDataStructure,
    data,
    isCreatingEntry,
    isLoadingForData: isLoading,
    onDelete,
    onDeleteSucceeded,
    onPost,
    onPublish,
    onPut,
    onUnpublish,
    redirectionLink: '/',
    status,
  });
};

SingleTypeFormWrapper.propTypes = {
  allLayoutData: PropTypes.shape({
    components: PropTypes.object.isRequired,
    contentType: PropTypes.object.isRequired,
  }).isRequired,
  children: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
};

export default memo(SingleTypeFormWrapper);
