package com.example.springbootvalidation.util;

import com.github.f4b6a3.ulid.UlidCreator;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

public class KeyGenerator implements IdentifierGenerator {

    @Override
    public Object generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        return UlidCreator.getUlid().toString();
    }
}
